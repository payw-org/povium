<?php
/**
 * Interface for request matcher.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Base\Routing\Matcher;

use Readigm\Base\Routing\Exception\NullPropertyException;
use Readigm\Base\Routing\Exception\MethodNotAllowedException;
use Readigm\Base\Routing\Exception\RouteNotFoundException;

interface RequestMatcherInterface
{
	/**
	 * Find a route that matches a request.
	 *
	 * @param string $request_method 	One of a HTTP methods
	 * @param string $request_uri
	 *
	 * @return array 	Route handler and required parameters
	 *
	 * @throws NullPropertyException		If route collection is null
	 * @throws MethodNotAllowedException	If matching method is not found
	 * @throws RouteNotFoundException		If matching pattern is not found
	 */
	public function match($request_method, $request_uri);
}
