<?php
/**
 * This factory is responsible for creating "ProfileInfoModuleLoader" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Loader\Module\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\User\UserManager;

class ProfileInfoModuleLoaderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$user_manager = $factory->createInstance(UserManager::class);

		$this->args[] = $user_manager;
	}
}
