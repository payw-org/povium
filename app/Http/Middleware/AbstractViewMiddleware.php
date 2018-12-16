<?php
/**
 * Abstract form for view middleware.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware;

abstract class AbstractViewMiddleware
{
	/**
	 * @var array
	 */
	protected $viewConfig = array();

	/**
	 * Verify request and load view config.
	 *
	 * @param 	mixed	URI data
	 */
	abstract public function requestView();

	/**
	 * @return array
	 */
	public function getViewConfig()
	{
		return $this->viewConfig;
	}
}
