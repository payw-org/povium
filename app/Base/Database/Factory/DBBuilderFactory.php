<?php
/**
 * This factory is responsible for creating "DBBuilder" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Base\Database\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Database\DBConnection;

class DBBuilderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$conn = DBConnection::getInstance()->getConn();
		$config = $this->configLoader->load('db_builder');

		$this->args[] = $conn;
		$this->args[] = $config;
	}
}
