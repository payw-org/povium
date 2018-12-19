<?php
/**
* Create series table.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

class CreateSeriesTable
{
	/**
	 * Returns sql for creating series table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS series (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			title VARCHAR(128) NOT NULL,
			contents JSON NOT NULL,
			publication_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			description VARCHAR(256),
			thumbnail VARCHAR(512),
			CONSTRAINT FK__user__series FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping series table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS series";

		return $sql;
	}
}
