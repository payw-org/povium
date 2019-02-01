<?php
/**
 * Record manager which is responsible for managing(CRUD) table record.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Record;

abstract class AbstractRecordManager implements RecordManagerInterface
{
	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @param \PDO	$conn
	 * @param array $config
	 */
	public function __construct(\PDO $conn, array $config)
	{
		$this->conn = $conn;
		$this->config = $config;
	}

	/**
	 * {@inheritdoc}
	 */
	public function getRecord($id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->config['table']}
			WHERE id = ?"
		);
		$stmt->execute([$id]);

		if ($stmt->rowCount() == 0) {
			return false;
		}

		$record = $stmt->fetch();

		return $record;
	}

	/**
	 * {@inheritdoc}
	 */
	abstract public function addRecord();

	/**
	 * {@inheritdoc}
	 */
	public function updateRecord($id, $params)
	{
		$col_list = array();
		$val_list = array();

		foreach ($params as $col => $val) {
			array_push($col_list, $col . ' = ?');
			array_push($val_list, $val);
		}
		array_push($val_list, $id);

		$set_params = implode(', ', $col_list);

		$stmt = $this->conn->prepare(
			"UPDATE {$this->config['table']}
 			SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}

	/**
	 * {@inheritdoc}
	 */
	public function deleteRecord($id)
	{
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['table']}
			WHERE id = ?"
		);
		$stmt->execute([$id]);

		return $stmt->rowCount() == 1;
	}

	/**
	 * Returns the ID of the last inserted table record.
	 *
	 * @return int|string	Table record id
	 */
	public function getLastInsertID()
	{
		return $this->conn->lastInsertId();
	}
}
