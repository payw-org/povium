<?php
/**
* Create user table.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

class CreateUserTable
{
	/**
	 * Returns sql for creating user table.
	 *
	 * @return string
	 */
	public function getCreateSQL()
	{
		$sql = "CREATE TABLE IF NOT EXISTS user (
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			readable_id VARCHAR(20) NOT NULL UNIQUE,
			name VARCHAR(30) NOT NULL UNIQUE,
			password VARCHAR(255) NOT NULL,
			is_verified BOOLEAN NOT NULL DEFAULT FALSE,
			is_active BOOLEAN NOT NULL DEFAULT TRUE,
			registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_login_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			profile_image VARCHAR(512) NOT NULL DEFAULT '/assets/images/profile/user-profile-default.svg',
			email VARCHAR(254) UNIQUE,
			bio VARCHAR(200)

		) ENGINE=InnoDB DEFAULT CHARSET=utf8";

		return $sql;
	}

	/**
	 * Returns sql for dropping user table.
	 *
	 * @return string
	 */
	public function getDropSQL()
	{
		$sql = "DROP TABLE IF EXISTS user";

		return $sql;
	}
}
