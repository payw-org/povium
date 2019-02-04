<?php
/**
 * This factory is responsible for creating "ProfileViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\MasterFactory;
use Povium\Loader\Module\Profile\ProfileInfoModuleLoader;
use Povium\Security\User\UserManager;

class ProfileViewControllerFactory extends StandardViewControllerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$factory = new MasterFactory();

		$profile_info_module_loader = $factory->createInstance(ProfileInfoModuleLoader::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$config = $this->configLoader->load('profile_view_controller');

		$this->args[] = $profile_info_module_loader;
		$this->args[] = $user_manager;
		$this->args[] = $config;
	}
}
