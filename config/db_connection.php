<?php
/**
* Config array for "DBConnection".
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

return [
	'driver' => 'mysql',
	'host' => '127.0.0.1',
	'dbname' => 'readigm_local_db',
	'username' => 'povium',
	'password' => 'welovepovium2018',
	'opt' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
		\PDO::ATTR_EMULATE_PREPARES => false
	]
];
