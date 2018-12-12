<?php
/**
 * This factory is responsible for creating "RouteServiceProvider" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider\Factory;

use Philo\Blade\Blade;
use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Auth\Authenticator;

class RouteServiceProviderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Authenticator
	 * @param Blade
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$factory = new MasterFactory();
		$authenticator = $materials[0];
		$blade = $materials[1];

		$this->args[] = $factory;
		$this->args[] = $authenticator;
		$this->args[] = $blade;
	}
}
