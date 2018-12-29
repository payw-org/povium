<?php
/**
 * This factory is responsible for creating "Authorizer" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Security\Auth\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Security\Auth\Authenticator;

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
