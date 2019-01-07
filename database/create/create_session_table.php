<?php
/**
* Create session table.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

class CreateSessionTable
{
	/**
	 * Returns sql for creating session table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS session (
			id VARCHAR(255) PRIMARY KEY,
			data TEXT,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			touched_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping session table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS session";

		return $sql;
	}
}
