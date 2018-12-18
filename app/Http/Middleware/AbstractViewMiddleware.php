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
	 * Verify request and load view config.
	 *
	 * @param 	mixed	URI data
	 *
	 * @return	array
	 */
	abstract public function requestViewConfig();
}
