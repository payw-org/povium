<?php
/**
 * This factory is responsible for creating "AuthServiceProvider" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Provider\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;

class AuthServiceProviderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$this->args[] = $factory;
	}
}
