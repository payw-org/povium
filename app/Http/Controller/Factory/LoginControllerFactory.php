<?php
/**
* This factory is responsible for creating "LoginController" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Http\Session\SessionManager;
use Povium\Http\Controller\Authentication\LoginFormValidationController;
use Povium\Security\Auth\Authenticator;
use Povium\Security\Encoder\PasswordEncoder;
use Povium\Security\User\UserManager;

class LoginControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Authenticator
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$factory = new MasterFactory();

		$authenticator = $materials[0];
		$session_manager = $factory->createInstance(SessionManager::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$password_encoder = $factory->createInstance(PasswordEncoder::class);
		$login_form_validation_controller = $factory->createInstance(LoginFormValidationController::class);
		$config = $this->configLoader->load('login_controller');

		$this->args[] = $authenticator;
		$this->args[] = $session_manager;
		$this->args[] = $user_manager;
		$this->args[] = $password_encoder;
		$this->args[] = $login_form_validation_controller;
		$this->args[] = $config;
	}
}
