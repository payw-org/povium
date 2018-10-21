<?php
/**
* Create autosave_post table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreateAutosavePostTable
{
	/**
	 * Returns sql for creating autosave_post table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS autosave_post (
			id INT(11) PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			title JSON NOT NULL,
			contents JSON NOT NULL,
			is_premium BOOLEAN NOT NULL,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			series_id INT(11) UNSIGNED,
			post_id VARCHAR(32),
			thumbnail VARCHAR(512),
			subtitle JSON,
			CONSTRAINT FK__user__autosave_post FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__series__autosave_post FOREIGN KEY (series_id)
			REFERENCES series (id) ON DELETE SET NULL ON UPDATE CASCADE,
			CONSTRAINT FK__post__autosave_post FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping autosave_post table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS autosave_post";

		return $sql;
	}
}
