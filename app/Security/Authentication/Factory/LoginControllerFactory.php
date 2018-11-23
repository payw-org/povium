<?php
/**
* This factory is responsible for creating "LoginController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Authentication\Authenticator;

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
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/login_controller.php');
		$login_form_validation_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\LoginFormValidationController');
		$password_encoder = $master_factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');
		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');
		$session_manager = $master_factory->createInstance('\Povium\Base\Http\Session\SessionManager');
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
