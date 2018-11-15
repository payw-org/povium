<?php
/**
* Interface for router.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Routing;

use Povium\Base\Routing\Matcher\RequestMatcherInterface;
use Povium\Base\Routing\Generator\URIGeneratorInterface;
use Povium\Base\Routing\Redirector\RedirectorInterface;
use Povium\Base\Routing\Exception\NullPropertyException;
use Povium\Base\Routing\Exception\NamedRouteNotFoundException;

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
