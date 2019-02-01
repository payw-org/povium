<?php
/**
 * Abstract form for controller for view page.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Controller;

abstract class AbstractViewController
{
	/**
	 * @var array
	 */
	protected $viewConfig = array();

	/**
	 * Load config for specific view page.
	 *
	 * @param mixed
	 *
	 * @return array
	 */
	abstract public function loadViewConfig();
}
