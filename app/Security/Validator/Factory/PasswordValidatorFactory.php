<?php
/**
* This factory is responsible for creating "PasswordValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
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
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/password_validator.php');

		$this->args[] = $zxcvbn;
		$this->args[] = $config;
	}
}
