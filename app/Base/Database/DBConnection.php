<?php
/**
* Create a database connection using PDO.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Base\Database;

use Povium\Loader\ConfigLoader;
use Povium\Traits\SingletonTrait;

class DBConnection
{
	/**
	 * Apply singleton pattern
	 */
	use SingletonTrait;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	private $conn;

	/**
	* Opens the database connection using PDO
	*/
	private function __construct()
	{
		$this->config = (new ConfigLoader())->load('db_connection');

		$this->generatePDOConnection();
	}

	/**
	* Closes the database connection
	*/
	public function __destruct()
	{
		$this->conn = null;
	}

	/**
	 * Generate PDO connection to database
	 */
	private function generatePDOConnection()
	{
		if ($this->conn === null) {
			$dsn =
				"" . $this->config['driver'] .
				":host=" . $this->config['host'] .
				";dbname=" . $this->config['dbname'];

			try {
				$this->conn = new \PDO(
					$dsn,
 					$this->config['username'],
 					$this->config['password'],
 					$this->config['opt']
				);
			} catch (\PDOException $e) {
				error_log("ERROR: " . $e->getMessage() . " on line " . __LINE__);
			}
		}
	}

	/**
	* Get connection
	*
	* @return \PDO pdo connection
	*/
	public function getConn()
	{
		return $this->conn;
	}
}
