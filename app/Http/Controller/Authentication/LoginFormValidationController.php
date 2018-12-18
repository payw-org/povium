<?php
/**
 * Controller for validating login form.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Authentication;

use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\Validator\UserInfo\ReadableIDValidator;

class LoginFormValidationController
{
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
	 * @var array
	 */
	private $config;

	/**
	 * @param ReadableIDValidator 	$readable_id_validator
	 * @param EmailValidator 		$email_validator
	 * @param PasswordValidator 	$password_validator
	 * @param array 				$config
	 */
	public function __construct(
		ReadableIDValidator $readable_id_validator,
		EmailValidator $email_validator,
		PasswordValidator $password_validator,
		array $config
	) {
		$this->readableIDValidator = $readable_id_validator;
		$this->emailValidator = $email_validator;
		$this->passwordValidator = $password_validator;
		$this->config = $config;
	}

	/**
	 * Check if fields of login form are valid.
	 *
	 * @param string $identifier	Readable id or email
	 * @param string $password
	 *
	 * @return bool
	 */
	public function isValid(
		$identifier,
		$password
	) {
		$validate_readable_id = $this->readableIDValidator->validate($identifier);

		//	Invalid readable id
		if ($validate_readable_id['err']) {
			$validate_email = $this->emailValidator->validate($identifier);

			//	Invalid email
			if ($validate_email['err']) {
				return false;
			}
		}

		$validate_password = $this->passwordValidator->validate($password);

		//	Invalid password
		if ($validate_password['err']) {
			return false;
		}

		return true;
	}

	/**
	 * Validate all fields of login form.
	 *
	 * @param string $identifier	Readable id or email
	 * @param string $password
	 *
	 * @return array	Validation results
	 */
	public function validateAllFields(
		$identifier,
		$password
	) {
		$return = array(
			'identifier_return' => [
				'err' => true,
				'msg' => ''
			],

			'password_return' => [
				'err' => true,
				'msg' => ''
			]
		);

		if (empty($identifier)) {
			$return['identifier_return']['msg'] = $this->config['msg']['identifier_empty'];
		} else {
			$return['identifier_return']['err'] = false;
		}

		if (empty($password)) {
			$return['password_return']['msg'] = $this->config['msg']['password_empty'];
		} else {
			$return['password_return']['err'] = false;
		}

		return $return;
	}
}
