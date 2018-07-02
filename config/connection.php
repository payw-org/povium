<?php
/**
* config array for database connection
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
* @license MIT
*/


return [
	'driver' => 'mysql',
	'host' => 'localhost',
	'dbname' => 'povium',
	'username' => 'povium',
	'password' => 'welovepoviumdb2018',
	'opt' => [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => FALSE
	]
];


?>
