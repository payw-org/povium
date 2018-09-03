<?php
/**
* Table to authenticate user.
* This table show connected users.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE session (
	id varchar(512) PRIMARY KEY,
	data text,
	creation_dt DATETIME NOT NULL,
	touched_dt DATETIME NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
