<?php
/**
 * Create deleted_post table.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

class CreateDeletedPostTable
{
	/**
	 * Returns sql for creating deleted_post table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS deleted_post (
			id INT(11) UNSIGNED PRIMARY KEY,
			deleted_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping deleted_post table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS deleted_post";

		return $sql;
	}
}
