<?php
/**
* Table for user info.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

$sql = "CREATE TABLE user (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	readable_id VARCHAR(20) NOT NULL UNIQUE,
	name VARCHAR(30) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	is_verified BOOLEAN NOT NULL DEFAULT FALSE,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
	registration_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_login_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	profile_image VARCHAR(512) NOT NULL DEFAULT 'C:/example/default_image.png',
	email VARCHAR(254) UNIQUE,
	bio VARCHAR(200)

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
