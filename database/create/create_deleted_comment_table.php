<?php
/**
 * Create deleted_comment table.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

class CreateDeletedCommentTable
{
	/**
	 * Returns sql for creating deleted_comment table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS deleted_comment (
			id INT(11) UNSIGNED PRIMARY KEY,
			deleted_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping deleted_comment table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS deleted_comment";

		return $sql;
	}
}
