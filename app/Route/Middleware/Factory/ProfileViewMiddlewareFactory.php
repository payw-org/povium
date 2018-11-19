<?php
/**
 * This factory is responsible for creating "ProfileViewMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;

class ProfileViewMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$user_manager = $master_factory->createInstance('\Povium\Security\User\UserManager');

		$this->args = array(
			$user_manager
		);
	}
}
