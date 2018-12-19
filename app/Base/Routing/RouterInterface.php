<?php
/**
* Interface for router.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Routing;

use Readigm\Base\Routing\Matcher\RequestMatcherInterface;
use Readigm\Base\Routing\Generator\URIGeneratorInterface;
use Readigm\Base\Routing\Redirector\RedirectorInterface;
use Readigm\Base\Routing\Exception\NullPropertyException;
use Readigm\Base\Routing\Exception\NamedRouteNotFoundException;

interface RouterInterface extends
	RequestMatcherInterface,
 	URIGeneratorInterface,
 	RedirectorInterface
{
	/**
	 * Dispatch a request to matched route.
	 *
	 * @param  string $request_method 	One of a HTTP methods
	 * @param  string $request_uri
	 *
	 * @throws NullPropertyException		If route collection is null
	 * @throws NamedRouteNotFoundException	If route name does not exist
	 */
	public function dispatch($request_method, $request_uri);
}
