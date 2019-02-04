<?php
/**
 * Abstract form for factory which is responsible for creating ajax middleware instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Middleware\Converter\CamelToSnakeConverter;

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
