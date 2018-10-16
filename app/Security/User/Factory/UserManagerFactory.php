<?php
/**
* This factory is responsible for creating "UserManager" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\User\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;

class UserManagerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/user_manager.php');
		$conn = DBConnection::getInstance()->getConn();
		$password_encoder = $master_factory->createInstance('\Povium\Security\Encoder\PasswordEncoder');

		$this->args = array(
			$config,
			$conn,
			$password_encoder
		);
	}
}
