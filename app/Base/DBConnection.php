<?php
/**
* Create a database connection using PDO
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base;

use Povium\Lib\Singleton;

class DBConnection
{
	/**
	* Apply singleton pattern.
	*/
	use Singleton;

	/**
	* Configuration parameters
	* Array('driver' => '', 'host' => '', 'dbname' => '', 'username' => '',
	* 'password' => '', 'opt' => '')
	* @var array
	*/
	private $config;

	/**
	* Database connection (PDO)
	* @var \PDO
	*/
	private $conn = null;

	/**
	* Opens the database connection using PDO
	*/
	private function __construct()
	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/connection.php');
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
		if ($this->conn == null) {
			$dsn = "" . $this->config['driver'] .
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
				echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
			}
		}
	}

	/**
	* Get connection
	* @return \PDO pdo connection
	*/
	public function getConn()
	{
		return $this->conn;
	}

	/* Deprecated */
	// /**
	// * Runs a INSERT, DELETE, UPDATE query using prepared statements
	// * @param  string $sql query string
	// * @return int      num of affected records
	// */
	// public function runQuery($sql)
	// {
	// 	try {
	// 		$stmt = $this->conn->prepare($sql);
	// 		$stmt->execute();
	//
	// 		$count = $stmt->rowCount();
	// 	} catch (\PDOException $e) {
	// 		echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
	// 	}
	//
	// 	return $count;
	// }
	//
	// /**
	// * Runs a SELECT query using prepared statements
	// * @param  string $sql query string
	// * @return PDOStatement you can fetch records using it
	// */
	// public function getQuery($sql)
	// {
	// 	try {
	// 		$stmt = $this->conn->prepare($sql);
	// 		$stmt->execute();
	// 	} catch (\PDOException $e) {
	// 		echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
	// 	}
	//
	// 	return $stmt;
	// }
}
