<?php
/**
 * This factory is responsible for creating "RegistrationFormValidationController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Validator\UserInfo\NameValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;
use Povium\Security\Validator\UserInfo\ReadableIDValidator;

class RegistrationFormValidationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$readable_id_validator = $factory->createInstance(ReadableIDValidator::class);
		$name_validator = $factory->createInstance(NameValidator::class);
		$password_validator = $factory->createInstance(PasswordValidator::class);

		$this->args = array(
			$readable_id_validator,
			$name_validator,
			$password_validator
		);
	}
}
