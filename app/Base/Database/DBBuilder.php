<?php
/**
 * Database builder.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Base\Database;

use Readigm\Loader\Database\SQLLoader;

class DBBuilder
{
	/* Database build options */
	const NOT_BUILD = 0;
	const CREATE = 1;
	const DROP_AND_CREATE = 2;

	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

	/**
	 * @var SQLLoader
	 */
	protected $sqlLoader;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO 		$conn
	 * @param SQLLoader $sql_loader
	 * @param array 	$config
	 */
	public function __construct(
		\PDO $conn,
		SQLLoader $sql_loader,
		array $config
	) {
		$this->conn = $conn;
		$this->sqlLoader = $sql_loader;
		$this->config = $config;
	}

	/**
	 * Build database.
	 * Create all tables.
	 *
	 * @param  int	$build_option
	 */
	public function build($build_option)
	{
		switch ($build_option) {
			case self::NOT_BUILD:

				return;
			case self::CREATE:
				$drop = false;

				break;
			case self::DROP_AND_CREATE:
				$drop = true;

				break;
		}

		$this->conn->exec("SET FOREIGN_KEY_CHECKS = 0");

		try {
			$this->conn->beginTransaction();

			if ($drop === true) {
				$this->dropAllTables();
			}

			$this->createAllTables();

			$this->conn->commit();
		} catch (\PDOException $e) {
			$this->conn->rollBack();
			error_log("ERROR: " . $e->getMessage() . " on line " . __LINE__);
		} finally {
			$this->conn->exec('SET FOREIGN_KEY_CHECKS = 1');
		}
	}

	/**
	 * Drop all tables in database.
	 *
	 * @throws \PDOException
	 */
	private function dropAllTables()
	{
		//	Make drop queries for all tables.
		$stmt = $this->conn->prepare(
			"SELECT concat('DROP TABLE IF EXISTS ', table_name, ';')
			FROM information_schema.tables
			WHERE table_schema = '{$this->config["dbname"]}';"
		);
		$stmt->execute();

		$drop_queries = $stmt->fetchAll(\PDO::FETCH_COLUMN);

		//	Execute each drop query.
		foreach ($drop_queries as $query) {
			$this->conn->exec($query);
		}
	}

	/**
	 * Create all tables.
	 *
	 * @throws \PDOException
	 */
	private function createAllTables()
	{
		foreach ($this->config['table_list'] as $table) {
			$sql = $this->sqlLoader->loadCreateSQL($table);

			$this->conn->exec($sql);
		}
	}
}
