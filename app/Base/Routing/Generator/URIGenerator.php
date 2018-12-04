<?php
/**
 * This can generate a URI for named routes based on the given arguments.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Generator;

use Povium\Base\Routing\RouteCollection;
use Povium\Base\Routing\Exception\NullPropertyException;
use Povium\Base\Routing\Exception\InvalidParameterException;

class URIGenerator implements URIGeneratorInterface
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var RouteCollection
	 */
	protected $routeCollection;

	/**
	 * @param array $config
	 */
	public function __construct(array $config)
	{
		$this->config = $config;
	}

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
	public function generate($name, $params = array(), $form = self::PATH)
	{
		if ($this->routeCollection === null) {
			throw new NullPropertyException('Route collection property is null.');
		}

		$route = $this->routeCollection->getRouteFromName($name);

		$pattern = $route->getPattern();

		return $this->generateFromPattern($pattern, $params, $form);
	}

	/**
	 * Generate URI using given pattern.
	 * Replace placeholders into given parameters.
	 *
	 * @param  string $pattern	Pattern for route
	 * @param  array  $params	Parameters to replace placeholders
	 * @param  int	  $form		URI form
	 *
	 * @return string	Generated URI
	 *
	 * @throws InvalidParameterException	If a parameter does not match with a placeholder
	 */
	private function generateFromPattern($pattern, $params, $form)
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
					//	If param is not exist
					if (!isset($params[$placeholders[$idx]])) {
						throw new InvalidParameterException('Invalid params for reversed routing. (Pattern: "' . $pattern . '")');
					}

					$param = $params[$placeholders[$idx]];

					//	If the param does not match the regex
					if (!preg_match('/^' . $regexes[$idx] . '$/', $param)) {
						throw new InvalidParameterException('Invalid params for reversed routing. (Pattern: "' . $pattern . '")');
					}

					//	If parameter length is too long
					if (mb_strlen($param) > $this->config['max_param_length']) {
						$param = mb_substr($param, 0, $this->config['max_param_length']);
					}

					//	Special case '@': Param is user's readable id.
					//	Do not encode this.
					if ($prefixes[$idx] != '@') {
						//	Encode param.
						//	Convert all special chars(include whitespace) to '-'.
						//	After convert, param is suitable form for uri.
						$param = preg_replace('/[^\p{L}0-9]/u', '-', $param);
					}

					//	Concatenate prefix and param that encoded to uri form.
					$sub_uri .= $prefixes[$idx] . $param;
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

		//	Convert to lowercase.
		$uri = mb_strtolower($uri);

		if ($form === self::URL) {
			$uri = BASE_URI . $uri;
		}

		return $uri;
	}
}
