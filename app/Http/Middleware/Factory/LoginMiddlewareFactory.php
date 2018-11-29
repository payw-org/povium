<?php
/**
 * This factory is responsible for creating "LoginMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\Auth\Authenticator;

class LoginMiddlewareFactory extends AbstractChildFactory
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
        $login_controller = $master_factory->createInstance('\Povium\Http\Controller\Authentication\LoginController', $authenticator);
        $redirect_uri_validator = $master_factory->createInstance('\Povium\Base\Routing\Validator\RedirectURIValidator');

        $this->args = array(
            $login_controller,
            $redirect_uri_validator
        );
    }
}
