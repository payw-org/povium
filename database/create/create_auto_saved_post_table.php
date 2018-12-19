<?php
/**
* Create auto_saved_post table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreateAutoSavedPostTable
{
	/**
	 * Returns sql for creating auto_saved_post table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS auto_saved_post (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL,
			title VARCHAR(128) NOT NULL,
			body MEDIUMTEXT NOT NULL,
			contents JSON NOT NULL,
			is_premium BOOLEAN NOT NULL,
			creation_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_edited_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			post_id INT(11) UNSIGNED UNIQUE,
			series_id INT(11) UNSIGNED,
			subtitle VARCHAR(256),
			thumbnail VARCHAR(512),
			CONSTRAINT FK__user__auto_saved_post FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__post__auto_saved_post FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__series__auto_saved_post FOREIGN KEY (series_id)
			REFERENCES series (id) ON DELETE SET NULL ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping auto_saved_post table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS auto_saved_post";

		return $sql;
	}
}