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
		$readable_id_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
		$email_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');
		$password_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');
		$password_encoder = $master_factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');
		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');
		$session_manager = $master_factory->createInstance('\Povium\Base\Http\Session\SessionManager');
		$authenticator = $materials[0];

		$this->args = array(
			$config,
			$readable_id_validator,
			$email_validator,
			$password_validator,
			$password_encoder,
			$user_manager,
			$session_manager,
			$authenticator
		);
	}
}
