<?php
/**
* This factory is responsible for creating "ReadableIDValidator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Security\Validator\Factory;

class ReadableIDValidatorFactory extends UserInfoDuplicateValidatorFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = $this->configLoader->load('readable_id_validator');

		$this->args[] = $config;
	}
}
