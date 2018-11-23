<?php
/**
 * This factory is responsible for creating "LoginFormValidationController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Security\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;

class LoginFormValidationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/login_form_validation_controller.php');
		$readable_id_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
		$email_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\EmailValidator');
		$password_validator = $master_factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');

		$this->args = array(
			$config,
			$readable_id_validator,
			$email_validator,
			$password_validator
		);
	}
}
