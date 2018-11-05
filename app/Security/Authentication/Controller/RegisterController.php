<?php
/**
* Control register.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Security\Validator\UserInfo\ReadableIDValidator;
use Povium\Security\Validator\UserInfo\NameValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\User\UserManager;

class RegisterController
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
	 * @var NameValidator
	 */
	protected $nameValidator;

	/**
	 * @var PasswordValidator
	 */
	protected $passwordValidator;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array               $config
	 * @param ReadableIDValidator $readable_id_validator
	 * @param NameValidator       $name_validator
	 * @param PasswordValidator   $password_validator
	 * @param UserManager		  $user_manager
	 */
	public function __construct(
		array $config,
		ReadableIDValidator $readable_id_validator,
		NameValidator $name_validator,
		PasswordValidator $password_validator,
		UserManager $user_manager
	) {
		$this->config = $config;
		$this->readableIDValidator = $readable_id_validator;
		$this->nameValidator = $name_validator;
		$this->passwordValidator = $password_validator;
		$this->userManager = $user_manager;
	}

	/**
	 * @return ReadableIDValidator
	 */
	public function getReadableIDValidator()
	{
		return $this->readableIDValidator;
	}

	/**
	 * @return NameValidator
	 */
	public function getNameValidator()
	{
		return $this->nameValidator;
	}

	/**
	 * @return PasswordValidator
	 */
	public function getPasswordValidator()
	{
		return $this->passwordValidator;
	}

	/**
	* Validate inputs for registration.
	* Then register user.
	*
	* @param  string	$readable_id
	* @param  string	$name
	* @param  string	$password
	*
	* @return array 	Error flag and message
	*/
	public function register($readable_id, $name, $password)
	{
		$return = array(
			'err' => true,
			'msg' => ''
		);

		/* Validate inputs */

		$validate_readable_id = $this->readableIDValidator->validate($readable_id, true);

		//	Invalid readable id
		if ($validate_readable_id['err']) {
			$return['msg'] = $validate_readable_id['msg'];

			return $return;
		}

		$validate_name = $this->nameValidator->validate($name, true);

		//	Invalid name
		if ($validate_name['err']) {
			$return['msg'] = $validate_name['msg'];

			return $return;
		}

		$validate_password = $this->passwordValidator->validate($password);

		//	Invalid password
		if ($validate_password['err']) {
			$return['msg'] = $validate_password['msg'];

			return $return;
		}

		/* Register processing */

		//	If failed to add user to database
		if (!$this->userManager->addRecord($readable_id, $name, $password)) {
			$return['msg'] = $this->config['msg']['registration_err'];

			return $return;
		}

		//	Register success
		$return['err'] = false;

		return $return;
	}
}
