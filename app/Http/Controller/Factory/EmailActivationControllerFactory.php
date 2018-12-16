<?php
/**
* This factory is responsible for creating "EmailActivationController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;
use Povium\Security\User\UserManager;

class EmailActivationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_controller.php');
		$conn = DBConnection::getInstance()->getConn();
		$user_manager = $factory->createInstance(UserManager::class);

		$this->args[] = $config;
		$this->args[] = $conn;
		$this->args[] = $user_manager;
	}
}
