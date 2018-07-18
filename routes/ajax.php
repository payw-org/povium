<?php
/**
* Set routes of ajax
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

/* Login Ajax */
$router->post(
	'/login',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/loginController.php';
		return true;
	}
);

/* Register confirm Ajax */
$router->post(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerConfirmController.php';
		return true;
	}
);

/* Register verify Ajax */
$router->put(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerVerifyController.php';
		return true;
	}
);

/* Logout Ajax */
$router->get(

	'/logout',

	function () {

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/logoutController.php';

		return true;

	}

);