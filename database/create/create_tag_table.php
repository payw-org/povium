<?php
/**
* Create tag table.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

class CreateTagTable
{
	/**
	 * Returns sql for creating tag table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS tag (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(64) NOT NULL UNIQUE,
			registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping tag table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS tag";

		return $sql;
	}
}
