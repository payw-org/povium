<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

use Povium\Base\Router;

$router = new Router();

$router->get('/', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/home.php';
});

$router->get('/login', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/login.php';
});

$router->get('/register', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/register.php';
});

$router->get('', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/404.php';
}, 'ERR_404');

$router->get('', function () {
	require $_SERVER['DOCUMENT_ROOT'] . '/../views/405.php';
}, 'ERR_405');


$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);


// var_dump($router->routes);
// echo "<br>";
// var_dump($router->namedRoutes);




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


?>
