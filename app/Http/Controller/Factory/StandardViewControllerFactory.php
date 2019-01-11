<?php
/**
 * Abstract form for factory which is responsible for creating standard view controller instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Loader\GlobalModule\GlobalNavigationLoader;

class StandardViewControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$global_navigation_loader = $factory->createInstance(GlobalNavigationLoader::class);

		$this->args[] = $global_navigation_loader;
	}
}
