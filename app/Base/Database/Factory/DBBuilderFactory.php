<?php
/**
 * This factory is responsible for creating "DBBuilder" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Base\Database\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Database\DBConnection;
use Povium\Base\Factory\MasterFactory;
use Povium\Loader\Database\SQLLoader;

class DBBuilderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$conn = DBConnection::getInstance()->getConn();
		$sql_loader = $factory->createInstance(SQLLoader::class);
		$config = $this->configLoader->load('db_builder');

		$this->args[] = $conn;
		$this->args[] = $sql_loader;
		$this->args[] = $config;
	}
}
