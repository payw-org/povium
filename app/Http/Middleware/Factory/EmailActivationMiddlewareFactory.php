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
use Povium\Http\Controller\Authentication\EmailActivationController;

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
		$factory = new MasterFactory();

		$router = $materials[0];
		$email_activation_controller = $factory->createInstance(EmailActivationController::class);

		$this->args[] = $router;
		$this->args[] = $email_activation_controller;
    }
}
