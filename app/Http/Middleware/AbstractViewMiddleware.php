<?php
/**
 * Abstract form for view middleware.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
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
