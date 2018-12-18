<?php
/**
 * This factory is responsible for creating "ProfileViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Loader\GlobalModule\GlobalNavigationLoader;
use Povium\Security\User\UserManager;

class ProfileViewControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$global_navigation_loader = $factory->createInstance(GlobalNavigationLoader::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/profile_view_controller.php');

		$this->args[] = $global_navigation_loader;
		$this->args[] = $user_manager;
		$this->args[] = $config;
	}
}
