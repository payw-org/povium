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
			contents JSON NOT NULL,
			title VARCHAR(200) NOT NULL,
			publication_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			thumbnail VARCHAR(512),
			description VARCHAR(500),
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
