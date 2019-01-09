<?php
/**
 * Bidirectional camel-snake converter.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Converter;

class CamelToSnakeConverter
{
	/**
	 * Convert camel case to snake case.
	 *
	 * @param string $str	Camel cased string
	 *
	 * @return string
	 */
	public function convert($str)
	{
		$snake_case = strtolower(preg_replace('/[A-Z]/', '_\\0', $str));

		return $snake_case;
	}

	/**
	 * Convert snake case to camel case.
	 *
	 * @param string $str	Snake cased string
	 *
	 * @return string
	 */
	public function reverse($str)
	{
		$camel_case = lcfirst(str_replace('_', '', ucwords($str, '_')));

		return $camel_case;
	}
}
