<?php
/**
* Table for editor type
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

$sql = "CREATE TABLE editor_types (
	id TINYINT(1) UNSIGNED PRIMARY KEY,
	name VARCHAR(12) NOT NULL UNIQUE

) ENGINE=InnoDB DEFAULT CHARSET=utf8";


/* Initialize editor types */
$insert_1 = "INSERT INTO editor_types (id, name) VALUES (1, 'public')";
$insert_2 = "INSERT INTO editor_types (id, name) VALUES (2, 'premium')";
