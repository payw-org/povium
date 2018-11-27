<?php
/**
* Controller for register.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Authentication;

use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;

class RegisterController
{
	/**
	* @var array
	*/
	private $config;

	/**
	 * @var RegistrationFormValidationController
	 */
	protected $registrationFormValidationController;

	/**
	 * @var PasswordEncoder
	 */
	protected $passwordEncoder;

	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @param array 								$config
	 * @param RegistrationFormValidationController 	$registration_form_validation_controller
	 * @param PasswordEncoder 						$password_encoder
	 * @param UserManager 							$user_manager
	 */
	public function __construct(
		array $config,
		RegistrationFormValidationController $registration_form_validation_controller,
		PasswordEncoder $password_encoder,
		UserManager $user_manager
	) {
		$this->config = $config;
		$this->registrationFormValidationController = $registration_form_validation_controller;
		$this->passwordEncoder = $password_encoder;
		$this->userManager = $user_manager;
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

		/* Validation check for fields of registration form */

		if (!$this->registrationFormValidationController->isValid(
			$readable_id,
			$name,
			$password
		)) {
			$return['msg'] = $this->config['msg']['incorrect_form'];

			return $return;
		}

		/* Register processing */

		$encoded_password = $this->passwordEncoder->encode($password);

		if (!$this->userManager->addRecord(
			$readable_id,
			$name,
			$encoded_password
		)) {
			$return['msg'] = $this->config['msg']['registration_err'];

			return $return;
		}

		//	Successfully registered
		$return['err'] = false;

		return $return;
	}
}
