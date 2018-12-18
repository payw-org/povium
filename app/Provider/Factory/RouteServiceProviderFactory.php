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
	 * @param Blade
	 * @param Authenticator
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$factory = new MasterFactory();
		$blade = $materials[0];
		$authenticator = $materials[1];

		$this->args[] = $factory;
		$this->args[] = $blade;
		$this->args[] = $authenticator;
	}
}
