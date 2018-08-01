<?php
session_start();
date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

$factory = new MasterFactory();
$router = $factory->createInstance('\Povium\Base\Routing\Router', $with_db = false);
$redirector = $factory->createInstance('\Povium\Base\Routing\Redirector', $with_db = false);
$auth = $factory->createInstance('\Povium\Auth', $with_db = true);

require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/http_status.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/middleware.php';

//	If possible, log in automatically.
$auth->isLoggedIn();
error_log(http_response_code());
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
