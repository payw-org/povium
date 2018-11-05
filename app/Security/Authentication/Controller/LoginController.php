<?php
/**
* Control login.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Security\Validator\UserInfo\ReadableIDValidator;
use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;
use Povium\Base\Http\Session\SessionManager;
use Povium\Security\Authentication\Authenticator;

class LoginController
{
	/**
	* @var array
	*/
	protected $config;

	/**
	 * @var ReadableIDValidator
	 */
	protected $readableIDValidator;

	/**
	 * @var EmailValidator
	 */
	protected $emailValidator;

	/**
	 * @var PasswordValidator
	 */
	protected $passwordValidator;

	/**
	 * @var PasswordEncoder
	 */
	protected $passwordEncoder;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @param array               $config
	 * @param ReadableIDValidator $readable_id_validator
	 * @param EmailValidator      $email_validator
	 * @param PasswordValidator   $password_validator
	 * @param PasswordEncoder	  $password_encoder
	 * @param UserManager		  $user_manager
	 * @param SessionManager	  $session_manager
	 * @param Authenticator       $authenticator
	 */
	public function __construct(
		array $config,
		ReadableIDValidator $readable_id_validator,
		EmailValidator $email_validator,
		PasswordValidator $password_validator,
		PasswordEncoder $password_encoder,
		UserManager $user_manager,
		SessionManager $session_manager,
		Authenticator $authenticator
	) {
		$this->config = $config;
		$this->readableIDValidator = $readable_id_validator;
		$this->emailValidator = $email_validator;
		$this->passwordValidator = $password_validator;
		$this->passwordEncoder = $password_encoder;
		$this->userManager = $user_manager;
		$this->sessionManager = $session_manager;
		$this->authenticator = $authenticator;
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

		/* Validate inputs */

		$validate_readable_id = $this->readableIDValidator->validate($identifier);

		//	Invalid readable id
		if ($validate_readable_id['err']) {
			$validate_email = $this->emailValidator->validate($identifier);

			//	Invalid email
			if ($validate_email['err']) {
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		$validate_password = $this->passwordValidator->validate($password);

		//	Invalid password
		if ($validate_password['err']) {
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		/* Check if registered account */

		//	Unregistered readable id
		if (false === $user_id = $this->userManager->getUserIDFromReadableID($identifier)) {
			//	Unregistered email
			if (false === $user_id = $this->userManager->getUserIDFromEmail($identifier)) {
				$return['msg'] = $this->config['msg']['account_incorrect'];

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
			$return['msg'] = $this->config['msg']['account_incorrect'];

			return $return;
		}

		//	Password need re-encode
		if (!empty($verify_password['new_encoded'])) {
			$params = array(
				'password' => $verify_password['new_encoded']
			);
			$this->userManager->updateRecord($user_id, $params);
		}

		/* Check if valid account */

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

		//	Login success
		$return['err'] = false;

		//	Update last login date
		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s')
		);
		$this->userManager->updateRecord($user_id, $params);

		return $return;
	}
}
