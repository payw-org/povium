<?php
/**
* Set routes for http status page.
* User cannot directly access below routes.
* DO NOT GENERATE URI FOR BELOW ROUTES.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

/* 403 Forbidden */
$router->get(
	'/*',
 	function ($err_msg) {
		http_response_code(403);
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_status/403.php';
	},
 	'ERR_403'
);

/* 404 Not Found Page */
$router->get(
	'/*',
 	function () {
		http_response_code(404);
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_status/404.php';
	},
 	'ERR_404'
);

/* 405 Method Not Allowed Page */
$router->get(
	'/*',
 	function () {
		http_response_code(405);
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_status/405.php';
	},
 	'ERR_405'
);

/* 410 Gone */
$router->get(
	'/*',
 	function ($err_msg) {
		http_response_code(410);
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_status/410.php';
	},
 	'ERR_410'
);
