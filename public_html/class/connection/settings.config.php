<?php
/*
*	PDO parameters for Database Connection 
*/


$attrs = array(
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES => FALSE
);


$config = array(
	'driver' => 'mysql',
	'host' => 'localhost',
	'dbname' => 'poviumdb',
	'username' => 'id',
	'password' => 'pw',
	'opt' => $attrs
);


?>
