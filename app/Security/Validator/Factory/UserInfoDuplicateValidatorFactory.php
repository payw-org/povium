<?php
/**
 * Abstract form for factory which is responsible for creating
 * user info duplicate validator instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Security\Validator\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Security\User\UserManager;

abstract class UserInfoDuplicateValidatorFactory extends AbstractChildFactory
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
