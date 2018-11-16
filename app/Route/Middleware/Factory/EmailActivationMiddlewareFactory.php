<?php
/**
 * This factory is responsible for creating "EmailActivationMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Security\User\User;

class EmailActivationMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Router
     * @param User
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();
        $master_factory = new MasterFactory();

        $email_activation_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\EmailActivationController');
        $router = $materials[0];
        $user = $materials[1];

        $this->args = array(
            $email_activation_controller,
            $router,
            $user
        );
    }
}
