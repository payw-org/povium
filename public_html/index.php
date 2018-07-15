<?php
session_start();
date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

use Povium\Base\Routing\Router;
use Povium\Base\Factory\MasterFactory;

$router = new Router();
$factory = new MasterFactory();
$auth = $factory->createInstance('\Povium\Auth');

//	If possible, log in automatically.
$auth->isLoggedIn();

require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/ajax.php';

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

// $params = array('readable_id' => 'fairy_hooni',
// 				'post_title' => "황치#$^훈의 ગુડબાય ---- ;'즐★거🤯운' PHP 교실 - vol.2",
// 				'post_id' => '684939');
// $uri = $router->generateURI('post', $params);
//
// echo "<a href=$uri>go</a>";

// $params = array('name' => 'fairyhooni');
// echo $router->generateURI('user_home', $params);


// $fp = fopen('php://input', 'r');
// $rawData = stream_get_contents($fp);
//
// echo "<pre>";
// print_r($rawData);
// echo "</pre>";




// $parsed_uris = explode('/', $_SERVER['REQUEST_URI']);
// echo "PARSED_URIS: ";
// print_r($parsed_uris);
// echo "<br>";
//
// foreach (array_keys($parsed_uris, '', true) as $key) {
// 	unset($parsed_uris[$key]);
// }
// var_dump($parsed_uris);



// echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "<br>";
//
// echo "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "<br>";
//
// echo "REQUEST: ";
// var_dump($_REQUEST);
// echo "<br>";

// $router->checkMatchedPattern('/login/hi', $_SERVER['REQUEST_URI']);


// require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
//
// use Povium\Base\Router;
//
// $router = new Router();
//
// $router->checkMatchedPattern('/@{name:.+}/{title:.+}-{id:\d+}', '/@/b');
