<?php
/**
* Create topic table.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

class CreateTopicTable
{
	/**
	 * Returns sql for creating topic table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS topic (
			id SMALLINT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(32) NOT NULL UNIQUE,
			description VARCHAR(250) NOT NULL,
			registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping topic table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS topic";

		return $sql;
	}
}
