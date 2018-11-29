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
use Povium\Security\User\UserManager;

class ProfileViewControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/profile_view_controller.php');
		$user_manager = $factory->createInstance(UserManager::class);

		$this->args = array(
			$config,
			$user_manager
		);
	}
}
