<?php
/**
 * Povium web
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

$factory = new MasterFactory();

//	Initialize session
$session_manager = $factory->createInstance('\Povium\Base\Session\SessionManager');
$session_manager->setSessionConfig();
$session_manager->checkAndSetSessionId();
session_start();

//	Initialize authentication system
$auth = $factory->createInstance('\Povium\Auth', $session_manager);

//	Initialize routing system
$router = $factory->createInstance('\Povium\Base\Routing\Router');
$redirector = $factory->createInstance('\Povium\Base\Routing\Redirector');

require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/../routes/middleware.php';

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
