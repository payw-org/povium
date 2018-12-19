<?php
/**
 * This factory is responsible for creating "LogoutMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\Authentication\LogoutController;
use Readigm\Security\Auth\Authenticator;

class LogoutMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Authenticator
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();
		$factory = new MasterFactory();

        $authenticator = $materials[0];
        $logout_controller = $factory->createInstance(LogoutController::class, $authenticator);

		$this->args[] = $logout_controller;
    }
}
