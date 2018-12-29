<?php
/**
* This factory is responsible for creating "PasswordEncoder" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Security\Encoder\Factory;

use Readigm\Base\Factory\AbstractChildFactory;

class PasswordEncoderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/password_encoder.php');

		$this->args[] = $config;
	}
}
