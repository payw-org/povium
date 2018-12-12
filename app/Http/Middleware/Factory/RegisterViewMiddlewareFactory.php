<?php
/**
 * This factory is responsible for creating "RegisterViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Http\Controller\Authentication\RegisterViewController;

class RegisterViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Router
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();
		$factory = new MasterFactory();

		$router = $materials[0];
		$register_view_controller = $factory->createInstance(RegisterViewController::class);

		$this->args[] = $router;
		$this->args[] = $register_view_controller;
	}
}
