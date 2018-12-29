<?php
/**
* This factory is responsible for creating "EmailValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
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

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_validator.php');

		$this->args[] = $config;
	}
}
