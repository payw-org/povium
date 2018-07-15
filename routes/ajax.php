<?php
/**
* Set routes of middleware
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

/* Login Middleware */
$router->post(
	'/login',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/loginController.php';
		return true;
	}
);

/* Register confirm Middleware */
$router->post(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerConfirmController.php';
		return true;
	}
);

/* Register verify Middleware */
$router->put(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerVerifyController.php';
		return true;
	}
);
