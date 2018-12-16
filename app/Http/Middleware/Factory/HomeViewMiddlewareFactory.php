<?php
/**
 * This factory is responsible for creating "HomeViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Home\HomeViewController;

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
