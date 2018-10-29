<?php
/**
* Create autosaved_post table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreateAutosavedPostTable
{
	/**
	 * Returns sql for creating autosaved_post table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS autosaved_post (
			id VARCHAR(32) PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			title VARCHAR(128) NOT NULL,
			body MEDIUMTEXT NOT NULL,
			contents JSON NOT NULL,
			is_premium BOOLEAN NOT NULL,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			post_id VARCHAR(32) UNIQUE,
			series_id INT(11) UNSIGNED,
			subtitle VARCHAR(256),
			thumbnail VARCHAR(512),
			CONSTRAINT FK__user__autosaved_post FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__post__autosaved_post FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__series__autosaved_post FOREIGN KEY (series_id)
			REFERENCES series (id) ON DELETE SET NULL ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping autosaved_post table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS autosaved_post";

		return $sql;
	}
}
