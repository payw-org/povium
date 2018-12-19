<?php
/**
 * This factory is responsible for creating "ProfileViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\MasterFactory;
use Readigm\Security\User\UserManager;

class ProfileViewControllerFactory extends StandardViewControllerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$factory = new MasterFactory();

		$user_manager = $factory->createInstance(UserManager::class);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/profile_view_controller.php');

		$this->args[] = $user_manager;
		$this->args[] = $config;
	}
}
