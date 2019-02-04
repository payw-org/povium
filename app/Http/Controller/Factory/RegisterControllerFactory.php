<?php
/**
* This factory is responsible for creating "RegisterController" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
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

		$user_manager = $factory->createInstance(UserManager::class);
		$password_encoder = $factory->createInstance(PasswordEncoder::class);
		$registration_form_validation_controller = $factory->createInstance(RegistrationFormValidationController::class);
		$config = $this->configLoader->load('register_controller');

		$this->args[] = $user_manager;
		$this->args[] = $password_encoder;
		$this->args[] = $registration_form_validation_controller;
		$this->args[] = $config;
	}
}
