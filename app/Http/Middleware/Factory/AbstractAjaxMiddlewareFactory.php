<?php
/**
 * Abstract form for factory which is responsible for creating ajax middleware instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Middleware\Converter\CamelToSnakeConverter;

abstract class AbstractAjaxMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$camel_to_snake_converter = $factory->createInstance(CamelToSnakeConverter::class);

		$this->args[] = $camel_to_snake_converter;
	}
}
