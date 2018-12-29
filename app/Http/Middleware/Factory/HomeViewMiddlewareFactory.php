<?php
/**
 * This factory is responsible for creating "HomeViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\Home\HomeViewController;

class HomeViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$home_view_controller = $factory->createInstance(HomeViewController::class);

		$this->args[] = $home_view_controller;
	}
}
