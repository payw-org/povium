<?php
/**
* Table for user membership.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE membership (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id INT(11) UNSIGNED NOT NULL UNIQUE,
	expn_dt DATETIME NOT NULL,
	CONSTRAINT FK__user__membership FOREIGN KEY (user_id)
	REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
