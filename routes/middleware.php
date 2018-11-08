<?php
/**
* Set routes for middleware.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use Povium\Security\Authorization\Authorizer;
use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

/**
 * Login Ajax
 */
$collection->post(
	'/login',
	function () use ($router) {
		if ($GLOBALS['authority_level'] >= Authorizer::USER) {
            $router->redirect('/');
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/login.php');
	}
);

/**
 * Register Ajax
 */
$collection->post(
	'/register',
	function () use ($router) {
		if ($GLOBALS['authority_level'] >= Authorizer::USER) {
		    $router->redirect('/');
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/register.php');
	}
);

/**
 * Validate register inputs Ajax
 */
$collection->put(
	'/register',
	function () use ($router) {
        if ($GLOBALS['authority_level'] >= Authorizer::USER) {
            $router->redirect('/');
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/validateRegisterInputs.php');
	}
);

/**
 * Logout Ajax
 */
$collection->post(
	'/logout',
	function () use ($router) {
		if ($GLOBALS['authority_level'] < Authorizer::USER) {
		    $router->redirect('/register');
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/logout.php');
	}
);

/**
 * Request email activation Ajax
 *
 * Get is Test mode. Original is post.
 */
$collection->get(
	'/me/settings/email/new-request',
	function () use ($router) {
        if ($GLOBALS['authority_level'] < Authorizer::USER) {
            $router->redirect('/register');
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/requestEmailActivation.php');
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
	function () use ($router) {
		if ($GLOBALS['authority_level'] < Authorizer::USER) {
		    $router->redirect('/login', true);
        }

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/Authentication/activateEmail.php');
	},
	'email_activation'
);
