<?php
/**
* Table for auto login authentication token.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/


$sql = "CREATE TABLE tokens (
	id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	selector VARCHAR(20) NOT NULL UNIQUE,
	validator VARCHAR(64) NOT NULL,
	user_id INT(11) UNSIGNED NOT NULL,
	expn_dt DATETIME NOT NULL,
	CONSTRAINT FK__tokens__users FOREIGN KEY (user_id)
	REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";

?>
