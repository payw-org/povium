<?php
/**
 * This factory is responsible for creating "LoginFormValidationController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Validator\UserInfo\EmailValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\Validator\UserInfo\ReadableIDValidator;

class LoginFormValidationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/login_form_validation_controller.php');
		$readable_id_validator = $factory->createInstance(ReadableIDValidator::class);
		$email_validator = $factory->createInstance(EmailValidator::class);
		$password_validator = $factory->createInstance(PasswordValidator::class);

		$this->args = array(
			$config,
			$readable_id_validator,
			$email_validator,
			$password_validator
		);
	}
}
