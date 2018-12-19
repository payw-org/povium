<?php
/**
 * Abstract form for controller for standard view page.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Controller;

use Readigm\Loader\GlobalModule\GlobalNavigationLoader;

abstract class StandardViewController extends AbstractViewController
{
	/**
	 * @var GlobalNavigationLoader
	 */
	protected $globalNavigationLoader;

	/**
	 * @param GlobalNavigationLoader $global_navigation_loader
	 */
	public function __construct(
		GlobalNavigationLoader $global_navigation_loader
	) {
		$this->globalNavigationLoader = $global_navigation_loader;
	}

	/**
	 * {@inheritdoc}
	 */
	public function loadViewConfig()
	{
		$this->viewConfig['global_nav'] = $this->globalNavigationLoader->loadData();

		return $this->viewConfig;
	}
}
