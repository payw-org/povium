<?php
/**
* This factory is responsible for creating "EmailActivationController" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Database\DBConnection;
use Readigm\Security\User\UserManager;

class EmailActivationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$conn = DBConnection::getInstance()->getConn();
		$user_manager = $factory->createInstance(UserManager::class);
		$config = $this->configLoader->load('email_activation_controller');

		$this->args[] = $conn;
		$this->args[] = $user_manager;
		$this->args[] = $config;
	}
}
