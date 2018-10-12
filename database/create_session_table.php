<?php
/**
* Table to authenticate user.
* This table show connected users.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE session (
	id VARCHAR(255) PRIMARY KEY,
	data TEXT,
	creation_dt DATETIME NOT NULL,
	touched_dt DATETIME NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
