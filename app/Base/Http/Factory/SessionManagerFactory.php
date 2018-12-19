<?php
/**
* This factory is responsible for creating "SessionManager" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Http\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Database\DBConnection;
use Readigm\Base\Http\Session\PDOSessionHandler;

class SessionManagerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$conn = DBConnection::getInstance()->getConn();
		$session_handler = $factory->createInstance(PDOSessionHandler::class);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');

		$this->args[] = $conn;
		$this->args[] = $session_handler;
		$this->args[] = $config;
	}
}
