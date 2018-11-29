<?php
/**
* This factory is responsible for creating "Authenticator" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Database\DBConnection;
use Povium\Base\Http\Client;
use Povium\Base\Http\Session\SessionManager;
use Povium\Generator\RandomStringGenerator;
use Povium\Security\User\UserManager;

class AuthenticatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/authenticator.php');
		$conn = DBConnection::getInstance()->getConn();
		$random_string_generator = $factory->createInstance(RandomStringGenerator::class);
		$client = $factory->createInstance(Client::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$session_manager = $factory->createInstance(SessionManager::class);

		$this->args = array(
			$config,
			$conn,
			$random_string_generator,
			$client,
			$user_manager,
			$session_manager
		);
	}
}
