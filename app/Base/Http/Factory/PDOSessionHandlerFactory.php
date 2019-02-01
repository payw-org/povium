<?php
/**
* This factory is responsible for creating "PDOSessionHandler" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
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
		$config = $this->configLoader->load('session');

		$this->args[] = $conn;
		$this->args[] = $config;
	}
}
