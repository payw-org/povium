<?php
/**
* This factory is responsible for creating "LoginController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
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

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/login_controller.php');
		$login_form_validation_controller = $factory->createInstance(LoginFormValidationController::class);
		$password_encoder = $factory->createInstance(PasswordEncoder::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$session_manager = $factory->createInstance(SessionManager::class);
		$authenticator = $materials[0];

		$this->args = array(
			$config,
			$login_form_validation_controller,
			$password_encoder,
			$user_manager,
			$session_manager,
			$authenticator
		);
	}
}
