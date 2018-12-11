<?php
/**
 * Povium web
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

/* Environment setting */

date_default_timezone_set("Asia/Seoul");
define('BASE_URI', 'http://' . $_SERVER['HTTP_HOST']);

/* Register the autoloader */

require($_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php');

/* Bootstrap the app */

$app = require_once($_SERVER['DOCUMENT_ROOT'] . '/../bootstrap/app.php');

/* Preset the app */

$shared_data = array(
	'is_logged_in' => $app['authenticator']->isLoggedIn()
);

$app['blade']->view()->share($shared_data);

/* Dispatch a request to router */

$app['router']->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

// use Hashids\Hashids;
//
// $hashids = new Hashids('Povium auto_saved_post', 12, 'abcdefghijklmnopqrstuvwxyz1234567890');
//
// $hash = $hashids->encode(90);
// echo $hash;
// echo "<br>";
// echo strlen($hash);
// echo "<br>";
// echo $hashids->decode($hash)[0];
