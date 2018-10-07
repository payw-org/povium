<?php
/**
* Control login.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Controller;

use Povium\Security\Validator\UserInfo\ReadableIDValidator;
use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\Auth\Auth;

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
	 * @var Auth
	 */
	protected $auth;

	/**
	 * @param array               $config
	 * @param ReadableIDValidator $readable_id_validator
	 * @param EmailValidator      $email_validator
	 * @param PasswordValidator   $password_validator
	 * @param Auth                $auth
	 */
	public function __construct(
		array $config,
		ReadableIDValidator $readable_id_validator,
		EmailValidator $email_validator,
		PasswordValidator $password_validator,
		Auth $auth
	) {
		$this->config = $config;
		$this->readableIDValidator = $readable_id_validator;
		$this->emailValidator = $email_validator;
		$this->passwordValidator = $password_validator;
		$this->auth = $auth;
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

		/* Validate account */

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

		$user_manager = $this->auth->getUserManager();

		//	Unregistered readable id
		if (false === $user_id = $user_manager->getUserIDFromReadableID($identifier)) {
			//	Unregistered email
			if (false === $user_id = $user_manager->getUserIDFromEmail($identifier)) {
				$return['msg'] = $this->config['msg']['account_incorrect'];

				return $return;
			}
		}

		//	Fetch user data
		$user = $user_manager->getUser($user_id);

		//	Verify password
		$password_encoder = $user_manager->getPasswordEncoder();
		$verify_password = $password_encoder->verifyAndReEncode($password, $user->getPassword());

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
			$user_manager->updateUser($user_id, $params);
		}

		//	Deleted account
		if ($user->isDeleted()) {
			$return['msg'] = $this->config['msg']['account_is_deleted'];

			return $return;
		}

		//	Inactive account
		if (!$user->isActive()) {
			$return['msg'] = $this->config['msg']['account_inactive'];

			return $return;
		}

		/* Login processing */

		$session_manager = $this->auth->getSessionManager();

		//	Regenerate session id
		$session_manager->regenerateSessionID(true, true);

		//	Error occurred issuing access key
		if (!$this->auth->addAccessKey($user_id)) {
			$return['msg'] = $this->config['msg']['issuing_access_key_err'];

			return $return;
		}

		//	Login success
		$return['err'] = false;

		//	Update last login date
		$params = array(
			'last_login_dt' => date('Y-m-d H:i:s')
		);
		$user_manager->updateUser($user_id, $params);

		return $return;
	}
}
