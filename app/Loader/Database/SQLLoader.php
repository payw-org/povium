<?php
/**
 * Loader for sql.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Loader\Database;

class SQLLoader
{
	/**
	 * Load sql for creating table.
	 *
	 * @param	string	$table	Table name
	 *
	 * @return	string
	 */
	public function loadCreateSQL($table)
	{
		$file = require($_SERVER['DOCUMENT_ROOT'] . '/../database/create/' . $table . '_table.php');

		$sql = $file['sql'];

		return $sql;
	}
}
