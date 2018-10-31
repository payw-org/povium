<?php
/**
 * Create deleted_series table.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

class CreateDeletedSeriesTable
{
	/**
	 * Returns sql for creating deleted_series table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS deleted_series (
			id INT(11) UNSIGNED PRIMARY KEY,
			deleted_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping deleted_series table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS deleted_series";

		return $sql;
	}
}
