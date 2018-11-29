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
        $register_controller = $factory->createInstance('\Povium\Http\Controller\Authentication\RegisterController');
        $login_controller = $factory->createInstance('\Povium\Http\Controller\Authentication\LoginController', $authenticator);
        $redirect_uri_validator = $factory->createInstance('\Povium\Base\Routing\Validator\RedirectURIValidator');

        $this->args = array(
            $register_controller,
            $login_controller,
            $redirect_uri_validator
        );
    }
}
