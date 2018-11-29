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

class RegistrationFormValidationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$readable_id_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
		$name_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\NameValidator');
		$password_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');

		$this->args = array(
			$readable_id_validator,
			$name_validator,
			$password_validator
		);
	}
}
