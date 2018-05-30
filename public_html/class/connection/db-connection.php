<?php
/*
* Class DBConnection
* Create a database connection using PDO
* @author fairyhooni
*
* Instructions for use:
*
* require_once('settings.config.php');				// Define db configuration arrays here
* require_once('db-connection.php');             	// Include this file
*
*/

class DBConnection{
	/**
	* configuration parameters
	* array('driver' => '', 'host' => '', 'dbname' => '', 'username' => '', 'password' => '', 'opt' => '')
	* @var array
	*/
	private $_config;


	/**
	* database connection (PDO)
	* @var \PDO
	*/
	private $conn;


	/**
	* [__construct description]
	* Opens the database connection using PDO
	* @param array $config [array of database connection parameters]
	*/
	public function __construct(array $config){
		$this->_config = $config;
		$this->getPDOConnection();
	}


	/**
	* [__destruct description]
	* Closes the database connection
	*/
	public function __destruct(){
		$this->conn = NULL;
	}


	/**
	* [getPDOConnection description]
	* Generate PDO connection to database
	*/
	private function getPDOConnection(){
		if($this->conn == NULL){
			$dsn = "" . $this->_config['driver'] .
			":host=" . $this->_config['host'] .
			";dbname=" . $this->_config['dbname'];

			try{
				$this->conn = new PDO($dsn, $this->_config['username'], $this->_config['password'], $this->_config['opt']);
			}catch(PDOException $e){
				echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
			}
		}
	}


	/**
	* [getConn description]
	* Get connection
	* @return \PDO [database connection]
	*/
	public function getConn(){
		return $this->conn;
	}


	/**
	* [runQuery description]
	* Runs a INSERT, DELETE, UPDATE query using prepared statements
	* @param  string $sql [query string]
	* @return int      [num of affected records]
	*/
	public function runQuery($sql){
		try{
			$stmt = $this->conn->prepare($sql);
			$stmt->execute();

			$count = $stmt->rowCount();
		}catch(PDOException $e){
			echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
		}

		return $count;
	}


	/**
	* [getQuery description]
	* Runs a SELECT query using prepared statements
	* @param  string $sql [query string]
	* @return statement      [you can fetch records using it]
	*/
	public function getQuery($sql){
		try{
			$stmt = $this->conn->prepare($sql);
			$stmt->execute();

			// $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			echo "ERROR: " . $e->getMessage() . " on line " . __LINE__;
		}

		return $stmt;
	}


}


?>
