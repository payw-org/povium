<?php
/**
* Controller for register.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

namespace Povium\Http\Controller\Authentication;

use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;

class RegisterController
{
	/**
	 * @var UserManager
	 */
	protected $userManager;

	/**
	 * @var PasswordEncoder
	 */
	protected $passwordEncoder;

	/**
	 * @var RegistrationFormValidationController
	 */
	protected $registrationFormValidationController;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param UserManager 							$user_manager
	 * @param PasswordEncoder 						$password_encoder
	 * @param RegistrationFormValidationController 	$registration_form_validation_controller
	 * @param array 								$config
	 */
	public function __construct(
		UserManager $user_manager,
		PasswordEncoder $password_encoder,
		RegistrationFormValidationController $registration_form_validation_controller,
		array $config
	) {
		$this->userManager = $user_manager;
		$this->passwordEncoder = $password_encoder;
		$this->registrationFormValidationController = $registration_form_validation_controller;
		$this->config = $config;
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
