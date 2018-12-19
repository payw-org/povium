<?php
/**
* This factory is responsible for creating "NameValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Security\Validator\Factory;

class NameValidatorFactory extends UserInfoDuplicateValidatorFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/name_validator.php');

		$this->args[] = $config;
	}
}
