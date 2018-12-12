<?php
/**
* This factory is responsible for creating "RegisterController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Authentication\RegistrationFormValidationController;
use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;

class RegisterControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');
		$registration_form_validation_controller = $factory->createInstance(RegistrationFormValidationController::class);
		$password_encoder = $factory->createInstance(PasswordEncoder::class);
		$user_manager = $factory->createInstance(UserManager::class);

		$this->args[] = $config;
		$this->args[] = $registration_form_validation_controller;
		$this->args[] = $password_encoder;
		$this->args[] = $user_manager;
	}
}
