<?php
/**
* This factory is responsible for creating "RegisterController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Auth\Auth;

class RegisterControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Auth
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');
		$readable_id_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
		$name_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\NameValidator');
		$password_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');
 		$auth = $materials[0];

		$this->args = array(
			$config,
			$readable_id_validator,
			$name_validator,
			$password_validator,
			$auth
		);
	}
}
