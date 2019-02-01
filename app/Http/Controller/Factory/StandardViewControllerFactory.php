<?php
/**
 * Abstract form for factory which is responsible for creating standard view controller instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Loader\Module\Globals\GlobalNavigationModuleLoader;

class StandardViewControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$global_navigation_module_loader = $factory->createInstance(GlobalNavigationModuleLoader::class);

		$this->args[] = $global_navigation_module_loader;
	}
}
