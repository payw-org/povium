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

class NameValidatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/name_validator.php');
		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');

		$this->args = array(
			$config,
			$user_manager
		);
	}
}
