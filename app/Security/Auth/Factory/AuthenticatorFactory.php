<?php
/**
* This factory is responsible for creating "Authenticator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
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
