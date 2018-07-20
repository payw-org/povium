<?php
/**
* Table for auto login authentication token.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

$sql = "CREATE TABLE email_auth (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	key VARCHAR(64) NOT NULL,
	user_id INT(11) UNSIGNED NOT NULL UNIQUE,
	input_email VARCHAR(50) NOT NULL,
	expn_dt DATETIME NOT NULL,
	CONSTRAINT FK__auto_login_auth__users FOREIGN KEY (user_id)
	REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";
