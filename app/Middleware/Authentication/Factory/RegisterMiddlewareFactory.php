<?php
/**
 * This factory is responsible for creating "RegisterMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Authentication\Authenticator;

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
        $master_factory = new MasterFactory();

        $authenticator = $materials[0];
        $register_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\RegisterController');
        $login_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\LoginController', $authenticator);
        $redirect_uri_validator = $master_factory->createInstance('\Povium\Base\Routing\Validator\RedirectURIValidator');

        $this->args = array(
            $register_controller,
            $login_controller,
            $redirect_uri_validator
        );
    }
}
