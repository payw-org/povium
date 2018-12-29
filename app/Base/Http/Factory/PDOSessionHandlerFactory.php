<?php
/**
* This factory is responsible for creating "PDOSessionHandler" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Http\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Database\DBConnection;

class PDOSessionHandlerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$conn = DBConnection::getInstance()->getConn();
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');

		$this->args[] = $conn;
		$this->args[] = $config;
	}
}
