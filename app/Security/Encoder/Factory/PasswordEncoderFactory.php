<?php
/**
* This factory is responsible for creating "PasswordEncoder" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Security\Encoder\Factory;

use Povium\Base\Factory\AbstractChildFactory;

class PasswordEncoderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = $this->configLoader->load('password_encoder');

		$this->args[] = $config;
	}
}
