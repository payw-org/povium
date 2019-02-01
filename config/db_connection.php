<?php
/**
* Config array for "DBConnection".
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

return [
	'driver' => 'mysql',
	'host' => '127.0.0.1',
	'dbname' => 'povium_local_db',
	'username' => 'payw',
	'password' => 'welovepayw2019',
	'opt' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
		\PDO::ATTR_EMULATE_PREPARES => false
	]
];
