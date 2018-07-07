<?php
/**
* This is a RESTful based router.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base;

use Povium\Base\Route;

class Router {
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
	public function addRoute ($http_method, $pattern, $handler, $name=null) {
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
	public function get ($pattern, $handler, $name=null) {
		$this->addRoute('GET', ...func_get_args());
	}


	/**
	* Add route with POST method
	* CREATE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function post ($pattern, $handler, $name=null) {
		$this->addRoute('POST', ...func_get_args());
	}


	/**
	* Add route with PUT method
	* UPDATE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function put ($pattern, $handler, $name=null) {
		$this->addRoute('PUT', ...func_get_args());
	}


	/**
	* Add route with DELETE method
	* DELETE mode
	* @param string $pattern uri pattern
	* @param callback $handler
	* @param string $name Router name. It is optional param.
	 */
	public function delete ($pattern, $handler, $name=null) {
		$this->addRoute('DELETE', ...func_get_args());
	}


	/**
	 * Dispatch a given Request URI to matched routes.
	 * @param  string $http_method One of a HTTP methods
	 * @param  string $request_uri
	 */
	public function dispatch ($http_method, $request_uri) {
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
	 * @param  string $http_method One of a HTTP methods
	 * @param  string $request_uri
	 * @return array Result and else things
	 */
	public function findMatchedRoute ($http_method, $request_uri) {
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
	public function checkMatchedPattern ($pattern, $request_uri) {
		$params = array();

		//	If pattern is special case, do not compare.
		if ($pattern === '') {
			return false;
		}

		//	Strip query string (?a=b) from Request URI
		if (false !== $pos = mb_strpos($request_uri, '?')) {
			$request_uri = mb_substr($request_uri, 0, $pos);
		}

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

		//	If length is not equal, return false;
		if (count($parsed_patterns) !== $len = count($parsed_uris)) {
			return false;
		}

		//	Compare each uri with pattern
		for ($i = 0; $i < $len; $i++) {
			$parsed_pattern = array_shift($parsed_patterns);
			$parsed_uri = array_shift($parsed_uris);

			//	Pattern include regex part '{}'.
			if (false !== $pos = mb_strpos($parsed_pattern, '{')) {
				$regex = '';
				$placeholders = array();

				//	Extract placeholder and completed regex.
				$currPos = 0;
				while ($currPos < mb_strlen($parsed_pattern)) {
					//	If the regex part still exists
					if (false !== $oBracketPos = mb_strpos($parsed_pattern, '{', $currPos)) {
						//	Parse string before '{'. (fixed part)
						//	and concatenate to regex
						$regex .= mb_substr($parsed_pattern, $currPos, $oBracketPos - $currPos);

						//	Parse string between '{' and ':'. (placeholder part)
						//	and save as placeholder
						$currPos = $oBracketPos + 1;
						$colonPos = mb_strpos($parsed_pattern, ':', $currPos);
						array_push($placeholders, mb_substr($parsed_pattern, $currPos, $colonPos - $currPos));

						//	Parse string between ':' and '}'. (regex part)
						//	and parenthesize then concatenate to regex
						$currPos = $colonPos + 1;
						$cBracketPos = mb_strpos($parsed_pattern, '}', $currPos);
						$regex .= '(' . mb_substr($parsed_pattern, $currPos, $cBracketPos - $currPos) . ')';

						$currPos = $cBracketPos + 1;
					} else {
						//	Parse string after '}'. (fixed part)
						$regex .= mb_substr($parsed_pattern, $currPos);
						break;
					}
				}
				$regex = '/^' . $regex . '$/u';

				//	URI is not matchced with pattern.
				if (!preg_match($regex, $parsed_uri, $matches)) {
					return false;
				}

				//	Stored matched things.
				array_shift($matches);
				foreach ($placeholders as $placeholder) {
					$params[$placeholder] = array_shift($matches);
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

?>
