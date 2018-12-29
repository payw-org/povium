<?php
/**
 * This factory is responsible for creating "LoginViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Routing\Router;
use Readigm\Http\Controller\Authentication\LoginViewController;

class LoginViewMiddlewareFactory extends AbstractChildFactory
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
		$login_view_controller = $factory->createInstance(LoginViewController::class);

		$this->args[] = $router;
		$this->args[] = $login_view_controller;
	}
}
