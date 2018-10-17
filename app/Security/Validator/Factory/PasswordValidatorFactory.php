<?php
/**
* This factory is responsible for creating "PasswordValidator" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Validator\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use ZxcvbnPhp\Zxcvbn;

class PasswordValidatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/password_validator.php');
		$zxcvbn = new Zxcvbn();

		$this->args = array(
			$config,
			$zxcvbn
		);
	}
}