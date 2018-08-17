<?php
/**
* Table for auto login authentication.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE auth_autologin (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	selector CHAR(20) NOT NULL UNIQUE,
	user_id INT(11) UNSIGNED NOT NULL,
	validator CHAR(64) NOT NULL,
	expn_dt DATETIME NOT NULL,
	CONSTRAINT FK__user__auth_autologin FOREIGN KEY (user_id)
	REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
