<?php
/**
 * This factory is responsible for creating "DBBuilder" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Database\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Database\DBConnection;

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
