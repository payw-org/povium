<?php
/**
 * Record manager which is reponsible for managing table record.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Database\Record;

use Povium\Base\Database\Exception\InvalidParameterNumberException;

abstract class AbstractRecordManager
{
	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

	/**
	 * Table name
	 *
	 * @var string
	 */
	protected $table;

	/**
	 * Returns a table record.
	 *
	 * @param  int|string	$id		Table record id
	 *
	 * @return array|false
	 */
	public function getRecord($id)
	{
		$stmt = $this->conn->prepare(
			"SELECT * FROM {$this->table}
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
	 * Add new table record.
	 *
	 * @param mixed	Fields
	 *
	 * @return bool	Whether successfully added
	 *
	 * @throws InvalidParameterNumberException	If parameter number for creating record is not valid
	 */
	abstract public function addRecord();

	/**
	 * Update some fields of specific table record.
	 *
	 * @param  int|string	$id		Table record id
	 * @param  array 		$params	Assoc array (Field name => New value)
	 *
	 * @return bool	Whether successfully updated
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
			"UPDATE {$this->table}
 			SET " . $set_params .
			" WHERE id = ?"
		);
		if (!$stmt->execute($val_list)) {
			return false;
		}

		return true;
	}

	/**
	 * Delete a table record.
	 *
	 * @param  int|string	$id		Table record id
	 *
	 * @return bool	Whether successfully deleted
	 */
	public function deleteRecord($id)
	{
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->table}
			WHERE id = ?"
		);
		$stmt->execute([$id]);

		return $stmt->rowCount() == 1;
	}
}
