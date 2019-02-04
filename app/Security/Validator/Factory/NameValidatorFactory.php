<?php
/**
* This factory is responsible for creating "NameValidator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Security\Validator\Factory;

class NameValidatorFactory extends UserInfoDuplicateValidatorFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = $this->configLoader->load('name_validator');

		$this->args[] = $config;
	}
}
