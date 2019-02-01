<?php
/**
 * This factory is responsible for creating "RegisterMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Routing\Validator\RedirectURIValidator;
use Readigm\Http\Controller\Authentication\LoginController;
use Readigm\Http\Controller\Authentication\RegisterController;
use Readigm\Security\Auth\Authenticator;

class RegisterMiddlewareFactory extends AbstractAjaxMiddlewareFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Authenticator
     */
    protected function prepareArgs()
    {
    	parent::prepareArgs();

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
