<?php
/**
 * This factory is responsible for creating "LogoutMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Auth\Authenticator;

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
        $master_factory = new MasterFactory();

        $authenticator = $materials[0];
        $logout_controller = $master_factory->createInstance('\Povium\Http\Controller\Authentication\LogoutController', $authenticator);

        $this->args = array(
            $logout_controller
        );
    }
}
