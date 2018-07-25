<?php
session_start();
date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

$factory = new MasterFactory();
$router = $factory->createInstance('\Povium\Base\Routing\Router', $with_db=false);
$auth = $factory->createInstance('\Povium\Auth', $with_db=true);

require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/middleware.php';

//	If possible, log in automatically.
$auth->isLoggedIn();

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
// echo $_SERVER['REQUEST_URI'];
// $str = 'redirect=' . urlencode(BASE_URI . $_SERVER['REQUEST_URI']);
// echo $str;
// $str = http_build_query(array('redirect' => BASE_URI . $_SERVER['REQUEST_URI']));
// echo $str;
// echo "<br>" . rawurldecode($str);
// echo $_SERVER['REQUEST_METHOD'];
