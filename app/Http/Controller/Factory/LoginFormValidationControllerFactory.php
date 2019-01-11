<?php
/**
 * This factory is responsible for creating "LoginFormValidationController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Security\Validator\UserInfo\EmailValidator;
use Readigm\Security\Validator\UserInfo\PasswordValidator;
use Readigm\Security\Validator\UserInfo\ReadableIDValidator;

class LoginFormValidationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$readable_id_validator = $factory->createInstance(ReadableIDValidator::class);
		$email_validator = $factory->createInstance(EmailValidator::class);
		$password_validator = $factory->createInstance(PasswordValidator::class);
		$config = $this->configLoader->load('login_form_validation_controller');

		$this->args[] = $readable_id_validator;
		$this->args[] = $email_validator;
		$this->args[] = $password_validator;
		$this->args[] = $config;
	}
}
