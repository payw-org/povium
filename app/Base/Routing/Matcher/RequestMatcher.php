<?php
/**
 * Find a route that matches a request.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Matcher;

use Povium\Base\Routing\RouteCollection;
use Povium\Base\Routing\Exception\NullPropertyException;
use Povium\Base\Routing\Exception\MethodNotAllowedException;
use Povium\Base\Routing\Exception\RouteNotFoundException;

class RequestMatcher implements RequestMatcherInterface
{
	/**
	 * @var RouteCollection
	 */
	private $routeCollection;

	/**
	 * @param RouteCollection $collection
	 */
	public function setRouteCollection(RouteCollection $collection)
	{
		$this->routeCollection = $collection;
	}

	/**
	 * {@inheritdoc}
	 */
	public function match($request_method, $request_uri)
	{
		if ($this->routeCollection === null) {
			throw new NullPropertyException('Route collection property is null.');
		}

		$routes = $this->routeCollection->getRoutes();

		foreach ($routes as $pattern => $arr) {
			//	If pattern match
			if (false !== $params = $this->matchPattern($pattern, $request_uri)) {
				foreach ($arr as $route) {
					//	If http method match : Found
					if ($route->getHttpMethod() == $request_method) {
						$return['handler'] = $route->getHandler();
						$return['params'] = $params;

						return $return;
					} else {
						$allowed_methods[] = $route->getHttpMethod();
					}
				}
				//	Failed to find : Method not allowed
				throw new MethodNotAllowedException($allowed_methods);
			}
		}
		//	Failed to find : Not found
		throw new RouteNotFoundException();
	}

	/**
	 * Check that the URI matches the pattern.
	 *
	 * @param  string $pattern
	 * @param  string $uri
	 *
	 * @return array|false	If match, return the values for placeholders of pattern.
	 */
	private function matchPattern($pattern, $uri)
	{
		$params = array();

		//	If pattern is special case, do not compare.
		if ($pattern === '/*') {
			return false;
		}

		//	Strip query string (?a=b) from URI
		if (false !== $pos = mb_strpos($uri, '?')) {
			$uri = mb_substr($uri, 0, $pos);
		}

		//	Decoding two hex digits in raw url to literal characters.
		$uri = rawurldecode($uri);

		//	Parse pattern by slash and delete blank values
		$parsed_patterns = explode('/', $pattern);
		foreach (array_keys($parsed_patterns, '', true) as $key) {
			unset($parsed_patterns[$key]);
		}

		//	Parse uri by slash and delete blank values
		$parsed_uris = explode('/', $uri);
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
				if (!preg_match($regex, $parsed_uri, $match_values)) {
					return false;
				}

				//	Stored matched things.
				array_shift($match_values);
				$params = array_merge($params, array_combine($placeholders, $match_values));
			} else {	//	Not include regex part. Pattern is fixed string.
				if ($parsed_pattern !== $parsed_uri) {
					return false;
				}
			}
		}

		return $params;
	}
}
