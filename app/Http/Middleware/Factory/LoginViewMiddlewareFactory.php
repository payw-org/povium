<?php
/**
 * This factory is responsible for creating "LoginViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Http\Controller\Authentication\LoginViewController;

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
