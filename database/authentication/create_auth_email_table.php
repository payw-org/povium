<?php
/**
* Table for user email authentication.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE auth_email (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id INT(11) UNSIGNED NOT NULL UNIQUE,
	token CHAR(36) NOT NULL UNIQUE,
	requested_email VARCHAR(254) NOT NULL,
	expn_dt DATETIME NOT NULL,
	CONSTRAINT FK__user__auth_email FOREIGN KEY (user_id)
	REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
