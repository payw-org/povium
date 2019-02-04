<?php
/**
* Controller for login.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

namespace Povium\Http\Controller\Authentication;

use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;
use Povium\Base\Http\Session\SessionManager;
use Povium\Security\Auth\Authenticator;

class LoginController
{
	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var PasswordEncoder
	 */
	protected $passwordEncoder;

	/**
	 * @var LoginFormValidationController
	 */
	protected $loginFormValidationController;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param Authenticator 				$authenticator
	 * @param SessionManager 				$session_manager
	 * @param UserManager 					$user_manager
	 * @param PasswordEncoder 				$password_encoder
	 * @param LoginFormValidationController $login_form_validation_controller
	 * @param array 						$config
	 */
	public function __construct(
		Authenticator $authenticator,
		SessionManager $session_manager,
		UserManager $user_manager,
		PasswordEncoder $password_encoder,
		LoginFormValidationController $login_form_validation_controller,
		array $config
	) {
		$this->authenticator = $authenticator;
		$this->sessionManager = $session_manager;
		$this->userManager = $user_manager;
		$this->passwordEncoder = $password_encoder;
		$this->loginFormValidationController = $login_form_validation_controller;
		$this->config = $config;
	}

	/**
	 * @return array
	 */
	public function getConfig()
	{
		return $this->config;
	}

	/**
	* Validate account.
	* Then issue access key.
	*
	* @param  string 	$identifier Readable id or Email
	* @param  string 	$password
	*
	* @return array		Error flag and message
	*/
	public function login($identifier, $password)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		/* Validation check for fields of login form */

		if (!$this->loginFormValidationController->isValid(
			$identifier,
			$password
		)) {
			$return['msg'] = $this->config['msg']['incorrect_form'];

			return $return;
		}

		/* Check if registered account */

		//	Unregistered readable id
		if (false === $user_id = $this->userManager->getUserIDFromReadableID($identifier)) {
			//	Unregistered email
			if (false === $user_id = $this->userManager->getUserIDFromEmail($identifier)) {
				$return['msg'] = $this->config['msg']['incorrect_form'];

				return $return;
			}
		}

		/* Check if password match */

		//	Fetch user data
		$user = $this->userManager->getUser($user_id);

		//	Verify password
		$verify_password = $this->passwordEncoder->verifyAndReEncode($password, $user->getPassword());

		//	Password does not match
		if (!$verify_password['is_verified']) {
			$return['msg'] = $this->config['msg']['incorrect_form'];

			return $return;
		}

		//	Password need re-encode
		if (!empty($verify_password['new_encoded'])) {
			$params = array(
				'password' => $verify_password['new_encoded']
			);
			$this->userManager->updateRecord($user_id, $params);
		}

		/* Check if account is active */

		//	Inactive account
		if (!$user->isActive()) {
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}

		/* Login processing */

		$this->sessionManager->regenerateSessionID(true, true);

		//	Error occurred issuing access key
		if (!$this->authenticator->addAccessKey($user_id)) {
			$return['msg'] = $this->config['msg']['issuing_access_key_err'];

			return $return;
		}

		//	Successfully logged in
		$return['err'] = false;

		//	Update last login date
		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s')
		);
		$this->userManager->updateRecord($user_id, $params);

		return $return;
	}
}
