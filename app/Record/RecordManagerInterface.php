<?php
/**
 * Interface for table record manager.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Record;

use Povium\Record\Exception\InvalidParameterNumberException;

interface RecordManagerInterface
{
	/**
	 * Returns a table record.
	 *
	 * @param	int|string	$id		Table record id
	 *
	 * @return array|false
	 */
	public function getRecord($id);

	/**
	 * Add new table record.
	 *
	 * @param mixed	Fields
	 *
	 * @return bool	Whether successfully added
	 *
	 * @throws InvalidParameterNumberException	If parameter number for creating record is not valid
	 */
	public function addRecord();

	/**
	 * Update some fields of specific table record.
	 *
	 * @param  int|string	$id		Table record id
	 * @param  array 		$params	Assoc array (Field name => New value)
	 *
	 * @return bool	Whether successfully updated
	 */
	public function updateRecord($id, $params);

	/**
	 * Delete a table record.
	 *
	 * @param  int|string	$id		Table record id
	 *
	 * @return bool	Whether successfully deleted
	 */
	public function deleteRecord($id);
}
