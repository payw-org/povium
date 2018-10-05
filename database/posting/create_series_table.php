<?php
/**
* Table for series.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE series (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id INT(11) UNSIGNED NOT NULL,
	title VARCHAR(256) NOT NULL,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
	publication_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modified_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	thumbnail VARCHAR(512),
	description TEXT,
	CONSTRAINT FK__user__series FOREIGN KEY (user_id)
	REFERENCES user (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
