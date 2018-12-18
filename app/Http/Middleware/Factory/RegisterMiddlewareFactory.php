<?php
/**
 * This factory is responsible for creating "RegisterMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Validator\RedirectURIValidator;
use Povium\Http\Controller\Authentication\LoginController;
use Povium\Http\Controller\Authentication\RegisterController;
use Povium\Security\Auth\Authenticator;

class RegisterMiddlewareFactory extends AbstractChildFactory
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
		$redirect_uri_validator = $factory->createInstance(RedirectURIValidator::class);
		$login_controller = $factory->createInstance(LoginController::class, $authenticator);
		$register_controller = $factory->createInstance(RegisterController::class);

		$this->args[] = $redirect_uri_validator;
		$this->args[] = $login_controller;
		$this->args[] = $register_controller;
    }
}
