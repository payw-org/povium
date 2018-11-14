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
	function () use ($factory, $authenticator) {
	    if ($GLOBALS['authority'] >= Authorizer::USER) {
	        return;
        }

        $login_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\LoginMiddleware',
            $authenticator
        );
        $login_middleware->login();
	}
);

/**
 * Register Ajax
 */
$collection->post(
	'/register',
	function () use ($factory, $authenticator) {
	    if ($GLOBALS['authority'] >= Authorizer::USER) {
	        return;
        }

        $register_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\RegisterMiddleware',
            $authenticator
        );
        $register_middleware->register();
	}
);

/**
 * Validate registration form Ajax
 */
$collection->put(
	'/register',
	function () use ($factory) {
	    if ($GLOBALS['authority'] >= Authorizer::USER) {
	        return;
        }

        $registration_form_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\RegistrationFormMiddleware'
        );
        $registration_form_middleware->validateRegistrationForm();
	}
);

/**
 * Logout Ajax
 */
$collection->post(
	'/logout',
	function () use ($factory, $authenticator) {
	    if ($GLOBALS['authority'] == Authorizer::VISITOR) {
	        return;
        }

        $logout_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\LogoutMiddleware',
            $authenticator
        );
        $logout_middleware->logout();
	}
);

/**
 * Request email activation Ajax
 *
 * Get is Test mode. Original is post.
 */
$collection->get(
	'/me/settings/email/new-request',
	function () use ($factory, $authenticator, $router) {
	    if ($GLOBALS['authority'] == Authorizer::VISITOR) {
	        return;
        }

        $email_activation_request_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\EmailActivationRequestMiddleware',
            $router,
            $authenticator->getCurrentUser()
        );
        $email_activation_request_middleware->requestEmailActivation();
	}
);

/**
 * Email activation Link
 *
 * @throws ForbiddenHttpException		If invalid activation request
 * @throws GoneHttpException			If activation request has already expired
 */
$collection->get(
	'/c/email/activation',
	function () use ($factory, $authenticator, $router) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
		    $router->redirect('/login', true);
        }

        $email_activation_middleware = $factory->createInstance(
            '\Povium\Middleware\Authentication\EmailActivationMiddleware',
            $router,
            $authenticator->getCurrentUser()
        );
        $email_activation_middleware->activateEmail();
	},
	'email_activation'
);
