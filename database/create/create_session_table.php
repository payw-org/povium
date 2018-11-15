<?php
/**
* Create session table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
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
			creation_dt DATETIME NOT NULL,
			touched_dt DATETIME NOT NULL

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
