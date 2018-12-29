<?php
/**
* This factory is responsible for creating "ReadableIDValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Security\Validator\Factory;

class ReadableIDValidatorFactory extends UserInfoDuplicateValidatorFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/readable_id_validator.php');

		$this->args[] = $config;
	}
}
