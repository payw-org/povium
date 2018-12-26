<?php
/**
 * This factory is responsible for creating "ProfileInfoLoader" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Loader\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Security\User\UserManager;

class ProfileInfoLoaderFactory extends AbstractChildFactory
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
