<?php
/**
* Set routes for middleware.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

/* Login Ajax */
$router->post(
	'/login',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/loginController.php';
	}
);

/* Register confirm Ajax */
$router->post(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerConfirmController.php';
	}
);

/* Register verify Ajax */
$router->put(
	'/register',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/registerVerifyController.php';
	}
);

/* Logout Ajax */
$router->post(
	'/logout',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/logoutController.php';
	}
);

/* Register new email address Ajax */
#	Get is Test mode. Original is post.
$router->get(
	'/me/settings/email/new-registration',
	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/sendEmailForEmailAuthController.php';
	}
);

/* Email authentication page */
$router->get(
	'/c/account/verify',
	function () use ($auth, $redirector) {
		//	If visitor is not logged in, redirect to login page.
		if (!$auth->isLoggedIn()) {
			$redirector->redirect('/login', true);
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Controllers/Auth/emailAuthController.php';
	},
	'email_authentication'
);
