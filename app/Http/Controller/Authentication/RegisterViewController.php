<?php
/**
 * Controller for loading config of register view.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Authentication;

use Povium\Loader\GlobalModule\GlobalNavigationLoader;

class RegisterViewController
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
	 * Load config for register view.
	 *
	 * @return array
	 */
	public function loadViewConfig()
	{
		$view_config = array();

		$view_config['global_nav'] = $this->globalNavigationLoader->loadData();

		return $view_config;
	}
}
