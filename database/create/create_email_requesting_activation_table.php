<?php
/**
* Create email_requesting_activation table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreateEmailRequestingActivation
{
	/**
	 * Returns sql for creating email_requesting_activation table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS email_requesting_activation (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			user_id INT(11) UNSIGNED NOT NULL UNIQUE,
			token CHAR(36) NOT NULL UNIQUE,
			email VARCHAR(254) NOT NULL,
			expn_dt DATETIME NOT NULL,
			CONSTRAINT FK__user__email_requesting_activation FOREIGN KEY (user_id)
			REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping email_requesting_activation table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS email_requesting_activation";

		return $sql;
	}
}
