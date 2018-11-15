<?php
/**
 * Interface for URI generator.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Generator;

use Povium\Base\Routing\Exception\NullPropertyException;
use Povium\Base\Routing\Exception\NamedRouteNotFoundException;
use Povium\Base\Routing\Exception\InvalidParameterException;

interface URIGeneratorInterface
{
	/**
	 * Generate as URL form. Ex) "https://povium.com/foo/bar"
	 *
	 * @var integer
	 */
	const URL = 0;

	/**
	 * Generate as path form. Ex) "/foo/bar"
	 *
	 * @var integer
	 */
	const PATH = 1;

	/**
	 * Generate URI for named routes.
	 *
	 * @param  string $name		Route name
	 * @param  array  $params	Parameters to replace placeholders
	 * @param  int	  $form		URI form
	 *
	 * @return string	Generated URI
	 *
	 * @throws NullPropertyException		If route collection is null
	 * @throws NamedRouteNotFoundException	If route name does not exist
	 * @throws InvalidParameterException	If a parameter does not match with a placeholder
	 */
	public function generate($name, $params = array(), $form = self::PATH);
}
