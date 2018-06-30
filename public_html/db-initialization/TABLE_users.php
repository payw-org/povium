<?php
/**
*  This code is not for executing.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
* @license MIT
*/


$sql = "CREATE TABLE users (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) NOT NULL UNIQUE,
	name VARCHAR(40) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	is_verified BOOLEAN NOT NULL DEFAULT FALSE,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	last_login_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	reg_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	subs_stat BOOLEAN NOT NULL DEFAULT FALSE,
	subs_expn_dt DATETIME,
	editor_type_id TINYINT(1) UNSIGNED DEFAULT 1,
	CONSTRAINT FK__users__editor_types FOREIGN KEY (editor_type_id)
	REFERENCES editor_types (id) ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";

?>
