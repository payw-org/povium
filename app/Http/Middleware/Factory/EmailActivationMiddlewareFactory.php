<?php
/**
 * This factory is responsible for creating "EmailActivationMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;

class EmailActivationMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Router
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();
        $master_factory = new MasterFactory();

        $email_activation_controller = $master_factory->createInstance('\Povium\Http\Controller\Authentication\EmailActivationController');
        $router = $materials[0];

        $this->args = array(
            $email_activation_controller,
            $router
        );
    }
}
