<?php
/**
* This factory is responsible for creating "LoginController" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Http\Session\SessionManager;
use Readigm\Http\Controller\Authentication\LoginFormValidationController;
use Readigm\Security\Auth\Authenticator;
use Readigm\Security\Encoder\PasswordEncoder;
use Readigm\Security\User\UserManager;

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
