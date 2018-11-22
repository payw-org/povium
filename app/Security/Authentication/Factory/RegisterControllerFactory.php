<?php
/**
* This factory is responsible for creating "RegisterController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;

class RegisterControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/register_controller.php');
		$registration_form_validation_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\RegistrationFormValidationController');
		$password_encoder = $master_factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');
		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');

		$this->args = array(
			$config,
			$registration_form_validation_controller,
			$password_encoder,
			$user_manager
		);
	}
}
