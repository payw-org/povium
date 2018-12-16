<?php
/**
 * Bootstrap database services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Database\DBBuilder;
use Povium\Base\Database\DBConnection;
use Povium\Base\Factory\MasterFactory;

class DBServiceProvider implements ServiceProviderInterface
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @param MasterFactory $factory
	 */
	public function __construct(MasterFactory $factory)
	{
		$this->factory = $factory;
	}

	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		//	Connect to database
		DBConnection::getInstance();

		//	Build a database
		$db_builder = $this->factory->createInstance(DBBuilder::class);
		$db_builder->build(DBBuilder::NOT_BUILD);

		return $db_builder;
	}
}
