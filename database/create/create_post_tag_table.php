<?php
/**
* Create post_tag table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreatePostTagTable
{
	/**
	 * Returns sql for creating post_tag table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS post_tag (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			post_id INT(11) UNSIGNED NOT NULL,
			tag_id INT(11) UNSIGNED NOT NULL,
			CONSTRAINT FK__post__post_tag FOREIGN KEY (post_id)
			REFERENCES post (id) ON DELETE CASCADE ON UPDATE CASCADE,
			CONSTRAINT FK__tag__post_tag FOREIGN KEY (tag_id)
			REFERENCES tag (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping post_tag table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS post_tag";

		return $sql;
	}
}
