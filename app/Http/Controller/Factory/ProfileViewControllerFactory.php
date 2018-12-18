<?php
/**
 * This factory is responsible for creating "ProfileViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\MasterFactory;
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

		$user_manager = $factory->createInstance(UserManager::class);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/profile_view_controller.php');

		$this->args[] = $user_manager;
		$this->args[] = $config;
	}
}
