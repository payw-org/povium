<?php

/**
* This code is not for executing.
* Table for editor type
*/
$sql = "CREATE TABLE editor_types (
	id TINYINT(1) UNSIGNED PRIMARY KEY,
	name VARCHAR(12) NOT NULL UNIQUE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";

$constant1 = "INSERT INTO editor_types (id, name)
				VALUES (1, 'public')";

$constant2 = "INSERT INTO editor_types (id, name)
				VALUES (2, 'premium')";

?>
