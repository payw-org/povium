<?php
/**
 * This factory is responsible for creating "Authorizer" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Security\Authorization\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Security\Authentication\Authenticator;

class AuthorizerFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Authenticator
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();

        $authenticator = $materials[0];

        $this->args = array(
            $authenticator
        );
    }
}
