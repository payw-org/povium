<?php
/**
 * This factory is responsible for creating "LogoutMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Http\Controller\Authentication\LogoutController;
use Povium\Security\Auth\Authenticator;

class LogoutMiddlewareFactory extends AbstractAjaxMiddlewareFactory
{
    /**
     * {@inheritdoc}
     *
	 * @param Router
     * @param Authenticator
     */
    protected function prepareArgs()
    {
    	parent::prepareArgs();

        $materials = func_get_args();
		$factory = new MasterFactory();

        $router = $materials[0];
        $authenticator = $materials[1];
        $logout_controller = $factory->createInstance(LogoutController::class, $authenticator);

        $this->args[] = $router;
		$this->args[] = $logout_controller;
    }
}
