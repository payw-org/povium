<?php
/**
* This factory is responsible for creating "Authenticator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Security\Auth\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Database\DBConnection;
use Readigm\Base\Http\Client;
use Readigm\Base\Http\Session\SessionManager;
use Readigm\Generator\RandomStringGenerator;
use Readigm\Security\User\UserManager;

class AuthenticatorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$conn = DBConnection::getInstance()->getConn();
		$client = $factory->createInstance(Client::class);
		$session_manager = $factory->createInstance(SessionManager::class);
		$user_manager = $factory->createInstance(UserManager::class);
		$random_string_generator = $factory->createInstance(RandomStringGenerator::class);
		$config = $this->configLoader->load('authenticator');

		$this->args[] = $conn;
		$this->args[] = $client;
		$this->args[] = $session_manager;
		$this->args[] = $user_manager;
		$this->args[] = $random_string_generator;
		$this->args[] = $config;
	}
}
