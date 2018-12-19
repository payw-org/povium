<?php
/**
* This factory is responsible for creating "RegisterController" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\Authentication\RegistrationFormValidationController;
use Readigm\Security\Encoder\PasswordEncoder;
use Readigm\Security\User\UserManager;

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
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');

		$this->args[] = $user_manager;
		$this->args[] = $password_encoder;
		$this->args[] = $registration_form_validation_controller;
		$this->args[] = $config;
	}
}
