<?php

// $host = '127.0.0.1';
// $db   = 'test';
// $user = 'root';
// $pass = '';
// $charset = 'utf8mb4';
$host = 'localhost';
$db   = 'povium';
$user = 'povium';
$pass = 'welovepoviumdb2018';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = [
	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES   => false,
];

try{
	$dbh = new PDO('mysql:host=localhost;dbname=povium','povium','welovepoviumdb2018');
	die(json_encode(array('outcome' => true)));
}
catch(PDOException $ex){
	die(json_encode(array('outcome' => false, 'message' => 'Unable to connect')));
}

?>