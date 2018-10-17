<?php
/**
 * Povium web
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

require_once($_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php');

use Povium\Base\Factory\MasterFactory;

$factory = new MasterFactory();

/*
* To initialize povium database, uncomment 2 lines code below.
* To use drop option, use "true" param on "build" method.
*/
// $db_builder = $factory->createInstance('\Povium\Base\Database\DBBuilder');
// $db_builder->build(false);

//	Initialize session
$session_manager = $factory->createInstance('\Povium\Base\Http\Session\SessionManager');
$session_manager->setSessionConfig();
$session_manager->startSession();

//	Initialize authentication system
$auth = $factory->createInstance('\Povium\Security\Auth\Auth', $session_manager);

$template_engine = $factory->createInstance('\Povium\Base\Templating\TemplateEngine');

$router = $factory->createInstance('\Povium\Base\Routing\Router');

//	Create routes and add to collection.
$collection = $factory->createInstance('\Povium\Base\Routing\RouteCollection');
require_once($_SERVER['DOCUMENT_ROOT'] . '/../routes/web.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/../routes/middleware.php');

//	Set collection
$router->setRouteCollection($collection);

//	Dispatch a request
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
