<?php
/**
 * Abstract form for view middleware.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware;

abstract class AbstractViewMiddleware
{
	/**
	 * @var array
	 */
	protected $viewConfig = array();

	/**
	 * Verify view request and prepare view config.
	 *
	 * @param 	mixed	URI data
	 */
	abstract public function verifyViewRequest();

	/**
	 * @return array
	 */
	public function getViewConfig()
	{
		return $this->viewConfig;
	}
}
