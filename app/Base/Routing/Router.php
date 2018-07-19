<?php
/**
* This is a RESTful based router.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base\Routing;

use Povium\Base\Routing\Route;
use Povium\Exceptions\RouterException;

class Router
{
	const NOT_FOUND = 0;
	const METHOD_NOT_ALLOWED = 1;
	const FOUND = 2;

	/**
	 * Binding the same patterns
	 * array('$pattern' => Route_array)
	 * @var array
	 */
	private $routes = array();

	/**
	 * Array to store named routes in, used for reverse routing.
	 * @var array
	 */
	private $namedRoutes = array();

	/**
	 * @param string|string[] $http_method One of a HTTP methods or
	 * an array of multiple HTTP Methods (GET, POST, PUT, DELETE)
	 * @param string $pattern     uri pattern
	 * @param callback $handler
	 * @param string|string[] $name Router name. It is optional param.
	 */
	public function addRoute($http_method, $pattern, $handler, $name = null)
	{
		$http_method = (array)$http_method;
		$name = (array)$name;

		if (!array_key_exists($pattern, $this->routes)) {
			$this->routes[$pattern] = array();
		}

		foreach ($http_method as $method) {
			$route = new Route($method, $pattern, $handler);
			array_push($this->routes[$pattern], $route);

			if ($temp = array_shift($name)) {
				$this->namedRoutes[$temp] = $route;
			}
		}
	}

	/**
	 * Add route with GET method
	 * READ mode
	 * @param string $pattern uri pattern
	 * @param callback $handler
	 * @param string $name Router name. It is optional param.
	 */
	public function get($pattern, $handler, $name = null)
	{
		$this->addRoute('GET', ...func_get_args());
	}

	/**
	* Add route with POST method
	* CREATE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function post($pattern, $handler, $name = null)
	{
		$this->addRoute('POST', ...func_get_args());
	}

	/**
	* Add route with PUT method
	* UPDATE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function put($pattern, $handler, $name = null)
	{
		$this->addRoute('PUT', ...func_get_args());
	}

	/**
	* Add route with DELETE method
	* DELETE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function delete($pattern, $handler, $name = null)
	{
		$this->addRoute('DELETE', ...func_get_args());
	}

	/**
	 * Dispatch a given Request URI to matched routes.
	 * @param  string $http_method One of a HTTP methods
	 * @param  string $request_uri
	 */
	public function dispatch($http_method, $request_uri)
	{
		$routeInfo = $this->findMatchedRoute($http_method, $request_uri);

		/* Execute handler */
		switch ($routeInfo['result']) {
			case self::FOUND:
				$handler = $routeInfo[0];
				$params = $routeInfo[1];

				$result = call_user_func_array($handler, array_values($params));

				//	Found matched page.
				if ($result !== false) {
					break;
				}
				//	no break if $result is false
			case self::NOT_FOUND:
				if($this->namedRoutes['ERR_404'] !== null) {
					call_user_func($this->namedRoutes['ERR_404']->handler);
				}
				break;
			case self::METHOD_NOT_ALLOWED:
				if($this->namedRoutes['ERR_405'] !== null) {
					// TODO: Use below code.
					// $allowed_methods = $routeInfo[0];
					call_user_func($this->namedRoutes['ERR_405']->handler);
				}
				break;
		}

	}

	/**
	 * Reversed routing
	 * Generate the URI with given argument. Replace regexes with supplied parameters.
	 * @param  string $arg    	route name or pattern
	 * @param  array  $params	Associative array of parameters to replace placeholders with.
	 * @return string 			Suitable URI
	 */
	public function generateURI($arg, array $params = array())
	{
		//	If arg is route name
		if ($arg[0] != '/') {
			//	If nonexistent route name, throw exception.
			if (!isset($this->namedRoutes[$arg])) {
				throw new RouterException('Nonexistent route: "' . $arg . '"',
	 			RouterException::EXC_NONEXISTENT_ROUTE_NAME);
			}

			//	Get route's pattern
			$pattern = $this->namedRoutes[$arg]->pattern;
		} else {	//	Arg is pattern.
			$pattern = $arg;
		}

		return $this->generateURIWithPattern($pattern, $params);
	}

	/**
	 * Reversed routing
	 * Generate the URI with given pattern. Replace regexes with supplied parameters.
	 * @param  string $pattern
	 * @param  array  $params	 Associative array of parameters to replace placeholders with.
	 * @return string 			 Suitable URI
	 */
	private function generateURIWithPattern($pattern, array $params = array())
	{
		//	Parse pattern by slash and delete blank values
		$parsed_patterns = explode('/', $pattern);
		foreach (array_keys($parsed_patterns, '', true) as $key) {
			unset($parsed_patterns[$key]);
		}

		//	Generate URI by referring to each parsed pattern
		$uri = '';
		foreach ($parsed_patterns as $parsed_pattern) {
			$uri .= '/';
			$sub_uri = '';

			//	If pattern include regex part '{}'.
			if (false !== mb_strpos($parsed_pattern, '{')) {
				//	Extract prefix, placeholder, and regex from pattern.
				$extractor = '/([^{}]*)\{([\w]+):([^{}]+)\}/';
				$match_count = preg_match_all($extractor, $parsed_pattern, $matches);
				array_shift($matches);

				$prefixes = $matches[0];
				$placeholders = $matches[1];
				$regexes = $matches[2];

				//	Generate sub URI by referring to each regex part
				for ($idx = 0; $idx < $match_count; $idx++) {
					$param = $params[$placeholders[$idx]];

					//	If param is not exist
					if (!isset($param)) {
						throw new RouterException('Invalid params for reversed routing. (Pattern: "' . $pattern . '")',
						RouterException::EXC_INVALID_REVERSED_ROUTING);
					}

					//	If the param does not match the regex
					if (!preg_match('/^' . $regexes[$idx] . '$/', $param)) {
						throw new RouterException('Invalid params for reversed routing. (Pattern: "' . $pattern . '")',
						RouterException::EXC_INVALID_REVERSED_ROUTING);
					}

					//	Special case: Param is user's readable id.
					//	Do not encode this.
					if ($prefixes[$idx] == '@') {
						$sub_uri .= '@' . $param;
					} else {	//	Encode param.
						//	Convert all special chars(include whitespace) to '-'.
						//	After convert, param is suitible form for uri.
						$param = preg_replace('/[^\p{L}0-9]/u', '-', $param);

						//	Concatenate prefix and param that encoded to uri form.
						$sub_uri .= $prefixes[$idx] . $param;
					}
				}

				//	Delete '-' of both ends.
				$sub_uri = ltrim($sub_uri, '-');
				$sub_uri = rtrim($sub_uri, '-');

				//	Convert consecutive '-' to single thing.
				$sub_uri = preg_replace("/-{2,}/", '-', $sub_uri);

				$uri .= $sub_uri;
			} else {	//	Not include regex part. Pattern is fixed string.
				$uri .= $parsed_pattern;
			}

		}

		//	Convert to lowercase form.
		return mb_strtolower($uri);
	}

	/**
	 * @param  string $http_method One of a HTTP methods
	 * @param  string $request_uri
	 * @return array Result and else things
	 */
	private function findMatchedRoute($http_method, $request_uri)
	{
		$return = array('result' => '');

		/* Find route that matched URI */
		foreach ($this->routes as $pattern => $arr) {
			//	Found matched pattern
			if (false !== $params = $this->checkMatchedPattern($pattern, $request_uri)) {
				$matched_routes = $arr;

				foreach ($matched_routes as $route) {
					//	Found matched method : FOUND
					if ($route->http_method == $http_method) {
						$return['result'] = self::FOUND;
						$return[0] = $route->handler;
						$return[1] = $params;

						return $return;
					}
				}

				//	Not found matched method : METHOD_NOT_ALLOWED
				$return['result'] = self::METHOD_NOT_ALLOWED;
				$allowed_methods = array_column($matched_routes, 'http_method');
				$return[0] = $allowed_methods;

				return $return;
			}
		}

		// Not found matched pattern : NOT_FOUND
		$return['result'] = self::NOT_FOUND;

		return $return;
	}

	/**
	 * Check that the Request URI matches the pattern.
	 * @param  string $pattern     uri pattern
	 * @param  string $request_uri
	 * @return mixed array or false
	 */
	private function checkMatchedPattern($pattern, $request_uri)
	{
		$params = array();

		//	If pattern is special case, do not compare.
		if ($pattern === '/*') {
			return false;
		}

		//	Strip query string (?a=b) from Request URI
		if (false !== $pos = mb_strpos($request_uri, '?')) {
			$request_uri = mb_substr($request_uri, 0, $pos);
		}

		//	Decoding two hex digits in raw url to literal characters.
		$request_uri = rawurldecode($request_uri);

		//	Parse pattern by slash and delete blank values
		$parsed_patterns = explode('/', $pattern);
		foreach (array_keys($parsed_patterns, '', true) as $key) {
			unset($parsed_patterns[$key]);
		}

		//	Parse uri by slash and delete blank values
		$parsed_uris = explode('/', $request_uri);
		foreach (array_keys($parsed_uris, '', true) as $key) {
			unset($parsed_uris[$key]);
		}

		//	If length is not equal, return false.
		if (count($parsed_patterns) !== $len = count($parsed_uris)) {
			return false;
		}

		//	Compare each uri with pattern
		for ($i = 0; $i < $len; $i++) {
			$parsed_pattern = array_shift($parsed_patterns);
			$parsed_uri = array_shift($parsed_uris);

			//	Pattern include regex part '{}'.
			if (false !== mb_strpos($parsed_pattern, '{')) {
				$regex = '';

				//	Extract placeholders and regexes
				$extractor = '/([^{}]*)\{([\w]+):([^{}]+)\}/';
				$match_count = preg_match_all($extractor, $parsed_pattern, $matches);
				array_shift($matches);

				$prefixes = $matches[0];
				$placeholders = $matches[1];
				$regexes = $matches[2];

				for ($idx = 0; $idx < $match_count; $idx++) {		//	Make to one completed regex.
					$regex .= $prefixes[$idx];
					$regex .= '(' . $regexes[$idx] . ')';
				}
				$regex = '/^' . $regex . '$/';

				//	URI is not matchced with pattern.
				if (!preg_match($regex, $parsed_uri, $matches_value)) {
					return false;
				}

				//	Stored matched things.
				array_shift($matches_value);
				foreach ($placeholders as $placeholder) {
					$params[$placeholder] = array_shift($matches_value);
				}

			} else {	//	Not include regex part. Pattern is fixed string.
				if ($parsed_pattern !== $parsed_uri) {
					return false;
				}
			}

		}

		return $params;
	}
}
