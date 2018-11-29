<?php
/**
* This factory is responsible for creating "NameValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Validator\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\User\UserManager;

class NameValidatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/name_validator.php');
		$user_manager = $factory->createInstance(UserManager::class);

		$this->args = array(
			$config,
			$user_manager
		);
	}
}
