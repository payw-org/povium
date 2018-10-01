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
$collection->post(
	'/login',
	function () use ($auth, $router) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$router->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/login.php';
	}
);

/**
 * Register Ajax
 */
$collection->post(
	'/register',
	function () use ($auth, $router) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$router->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/register.php';
	}
);

/**
 * Validate register inputs Ajax
 */
$collection->put(
	'/register',
	function () use ($auth, $router) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$router->redirect('/');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/validateRegisterInputs.php';
	}
);

/**
 * Logout Ajax
 */
$collection->post(
	'/logout',
	function () use ($auth, $router) {
		//	If not logged in, redirect to register page.
		if (!$auth->isLoggedIn()) {
			$router->redirect('/register');
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/logout.php';
	}
);

/**
 * Request email activation Ajax
 *
 * Get is Test mode. Original is post.
 */
$collection->get(
	'/me/settings/email/new-request',
	function () use ($auth, $router) {
		//	If not logged in, redirect to register page.
		if (!$auth->isLoggedIn()) {
			$router->redirect('/register');
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
$collection->get(
	'/c/email/activation',
	function () use ($auth, $router) {
		//	If not logged in, redirect to login page.
		if (!$auth->isLoggedIn()) {
			$router->redirect('/login', true);
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Auth/activateEmailAddress.php';
	},
	'email_activation'
);
