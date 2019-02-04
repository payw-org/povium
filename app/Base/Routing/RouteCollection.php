<?php
/**
 * Manage a set of Route instances.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Base\Routing;

use Povium\Base\Routing\Exception\NamedRouteNotFoundException;

class RouteCollection
{
	/**
	 * Groups routes with the same pattern.
	 * The form is as follows...
	 * $routes => [
	 * 		'pattern_1' => [
	 * 			Route_1,
	 * 			Route_2
	 * 		]
	 * ]
	 *
	 * @var array
	 */
	private $routes = array();

	/**
	 * Array for named routes.
	 * Named routes used for reverse routing.
	 *
	 * @var array
	 */
	private $namedRoutes = array();

	/**
	 * Add route as GET method.
	 * Route for READ mode.
	 *
	 * @param	string		$pattern 	URI pattern
	 * @param	\Closure	$handler
	 * @param	string		$name 		Router name
	 */
	public function get($pattern, $handler, $name = "")
	{
		$this->addRoute('GET', ...func_get_args());
	}

	/**
	 * Add route as POST method.
	 * Route for CREATE mode.
	 *
	 * @param	string		$pattern 	URI pattern
	 * @param	\Closure	$handler
	 * @param	string		$name 		Router name
	 */
	public function post($pattern, $handler, $name = "")
	{
		$this->addRoute('POST', ...func_get_args());
	}

	/**
	 * Add route as PUT method.
	 * Route for UPDATE mode.
	 *
	 * @param	string		$pattern 	URI pattern
	 * @param	\Closure	$handler
	 * @param	string		$name 		Router name
	 */
	public function put($pattern, $handler, $name = "")
	{
		$this->addRoute('PUT', ...func_get_args());
	}

	/**
	 * Add route as DELETE method.
	 * Route for DELETE mode.
	 *
	 * @param	string		$pattern 	URI pattern
	 * @param	\Closure	$handler
	 * @param	string		$name 		Router name
	 */
	public function delete($pattern, $handler, $name = "")
	{
		$this->addRoute('DELETE', ...func_get_args());
	}

	/**
	 * Creates new route and add to collection.
	 *
	 * @param string 	$http_method 	One of a HTTP methods (GET, POST, PUT, DELETE)
	 * @param string 	$pattern     	URI pattern
	 * @param \Closure 	$handler
	 * @param string 	$name        	Router name
	 */
	private function addRoute($http_method, $pattern, $handler, $name = "")
	{
		$route = new Route($http_method, $pattern, $handler);

		$this->routes[$pattern][] = $route;

		if (!empty($name)) {
			$this->namedRoutes[$name] = $route;
		}
	}

	/**
	 * Returns all routes.
	 *
	 * @return array
	 */
	public function getRoutes()
	{
		return $this->routes;
	}

	/**
	 * Returns route instance from name.
	 *
	 * @param  string $name		Route name
	 *
	 * @return Route
	 *
	 * @throws NamedRouteNotFoundException	If route name does not exist
	 */
	public function getRouteFromName($name)
	{
		if (!isset($this->namedRoutes[$name])) {
			throw new NamedRouteNotFoundException('Nonexistent route name: "' . $name . '"');
		}

		return $this->namedRoutes[$name];
	}
}
