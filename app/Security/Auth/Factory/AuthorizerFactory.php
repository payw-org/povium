<?php
/**
 * This factory is responsible for creating "Authorizer" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Security\Auth\Authenticator;

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

		$this->args[] = $authenticator;
    }
}
