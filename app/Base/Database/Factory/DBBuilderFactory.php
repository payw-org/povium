<?php
/**
 * This factory is responsible for creating "DBBuilder" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
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
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/db_builder.php');

		$this->args[] = $conn;
		$this->args[] = $config;
	}
}
