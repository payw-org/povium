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

class RegisterControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');
		$registration_form_validation_controller = $factory->createInstance('\Povium\Http\Controller\Authentication\RegistrationFormValidationController');
		$password_encoder = $factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');
		$user_manager = $factory->createInstance('\Povium\Security\User\UserManager');

		$this->args = array(
			$config,
			$registration_form_validation_controller,
			$password_encoder,
			$user_manager
		);
	}
}
