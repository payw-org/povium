<?php
/**
* Create membership table.
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

class CreateMembershipTable
{
	/**
	 * Returns sql for creating membership table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS membership (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL UNIQUE,
			expn_dt DATETIME NOT NULL,
			CONSTRAINT FK__user__membership FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping membership table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS membership";

		return $sql;
	}
}
