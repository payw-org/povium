<?php

/**
 * This code is not for executing.
 * Table for authenticating auto login.
 */
$sql = "CREATE TABLE token_info(
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	selector VARCHAR(20) NOT NULL UNIQUE,
	validator VARCHAR(64) NOT NULL,
	uid INT(11) UNSIGNED NOT NULL,
	expire DATETIME NOT NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8";

?>
