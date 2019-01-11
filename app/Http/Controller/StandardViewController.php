<?php
/**
 * Abstract form for controller for standard view page.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Http\Controller;

use Readigm\Loader\Module\Globals\GlobalNavigationModuleLoader;

abstract class StandardViewController extends AbstractViewController
{
	/**
	 * @var GlobalNavigationModuleLoader
	 */
	protected $globalNavigationModuleLoader;

	/**
	 * @param GlobalNavigationModuleLoader $global_navigation_module_loader
	 */
	public function __construct(
		GlobalNavigationModuleLoader $global_navigation_module_loader
	) {
		$this->globalNavigationModuleLoader = $global_navigation_module_loader;
	}

	/**
	 * {@inheritdoc}
	 */
	public function loadViewConfig()
	{
		$this->viewConfig['global_nav'] = $this->globalNavigationModuleLoader->loadData();

		return $this->viewConfig;
	}
}
