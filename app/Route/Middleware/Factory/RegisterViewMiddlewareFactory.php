<?php
/**
 * This factory is responsible for creating "RegisterViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Routing\Router;

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

		$router = $materials[0];

		$this->args = array(
			$router
		);
	}
}
