<?php
/**
* This factory is responsible for creating "PasswordValidator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Security\Validator\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use ZxcvbnPhp\Zxcvbn;

class PasswordValidatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$zxcvbn = new Zxcvbn();
		$config = $this->configLoader->load('password_validator');

		$this->args[] = $zxcvbn;
		$this->args[] = $config;
	}
}
