<?php
/**
 * Abstract form for view middleware.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware;

abstract class AbstractViewMiddleware
{
	/**
	 * Verify request and load view config.
	 *
	 * @param 	mixed
	 *
	 * @return	array
	 */
	abstract public function requestViewConfig();
}
