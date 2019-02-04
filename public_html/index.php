<?php
/**
 * Povium web
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

/* Environment setting */

date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

/* Register the autoloader */

require($_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php');

/* Bootstrap the app */

$app = require_once($_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/app.php');

/* Dispatch a request to router */

$app['router']->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
