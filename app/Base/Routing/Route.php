<?php
/**
* A single route.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Base\Routing;

class Route
{
	/**
	 * One of a HTTP methods
	 * GET : READ
	 * POST : CREATE
	 * PUT : UPDATE
	 * DELETE : DELETE
	 *
	 * @var string
	 */
	private $httpMethod;

	/**
	 * URI pattern with regular expressions.
	 *
	 * @var string
	 */
	private $pattern;

	/**
	 * @var \Closure
	 */
	private $handler;

	/**
	 * @param	string		$http_method
	 * @param	string		$pattern
	 * @param	\Closure	$handler
	 */
	public function __construct(string $http_method, string $pattern, \Closure $handler)
	{
		$this->httpMethod = strtoupper($http_method);
		$this->pattern = $pattern;
		$this->handler = $handler;
	}

	/**
	 * @return string
	 */
	public function getHttpMethod()
	{
		return $this->httpMethod;
	}

	/**
	 * @return string
	 */
	public function getPattern()
	{
		return $this->pattern;
	}

	/**
	 * @return \Closure
	 */
	public function getHandler()
	{
		return $this->handler;
	}
}
