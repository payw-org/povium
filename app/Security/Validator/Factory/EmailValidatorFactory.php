<?php
/**
* This factory is responsible for creating "EmailValidator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Security\Validator\Factory;

class EmailValidatorFactory extends UserInfoDuplicateValidatorFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = $this->configLoader->load('email_validator');

		$this->args[] = $config;
	}
}
