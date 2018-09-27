<?php
/**
* Set routes for middleware.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

/**
 * Login Ajax
 */
$router->post(
	'/login',
	function () use ($auth, $redirector) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$redirector->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/login.php';
	}
);

/**
 * Register Ajax
 */
$router->post(
	'/register',
	function () use ($auth, $redirector) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$redirector->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/register.php';
	}
);

/**
 * Validate register inputs Ajax
 */
$router->put(
	'/register',
	function () use ($auth, $redirector) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$redirector->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/validateRegisterInputs.php';
	}
);

/**
 * Logout Ajax
 */
$router->post(
	'/logout',
	function () use ($auth, $redirector) {
		//	If not logged in, redirect to register page.
		if (!$auth->isLoggedIn()) {
			$redirector->redirect('/register');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/logout.php';
	}
);

/**
 * Request email activation Ajax
 *
 * Get is Test mode. Original is post.
 */
$router->get(
	'/me/settings/email/new-request',
	function () use ($auth, $redirector) {
		//	If not logged in, redirect to register page.
		if (!$auth->isLoggedIn()) {
			$redirector->redirect('/register');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/requestEmailActivation.php';
	}
);

/**
 * Email activation Link
 *
 * @throws ForbiddenHttpException		If invalid activation request
 * @throws GoneHttpException			If activation request has expired
 */
$router->get(
	'/c/email/activation',
	function () use ($auth, $redirector) {
		//	If not logged in, redirect to login page.
		if (!$auth->isLoggedIn()) {
			$redirector->redirect('/login', true);
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/activateEmailAddress.php';
	},
	'email_activation'
);
