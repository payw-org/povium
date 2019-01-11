<?php
/**
* This factory is responsible for creating "PasswordEncoder" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
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
		$config = $this->configLoader->load('password_encoder');

		$this->args[] = $config;
	}
}
