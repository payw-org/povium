<?php
/**
* Set routes for web.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use Povium\Security\Authorization\Authorizer;
use Povium\Base\Http\Exception\NotFoundHttpException;
use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

/**
 * Show home view.
 */
$collection->get(
	'/',
	function () use ($factory, $blade) {
		$home_view_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Home\HomeViewMiddleware'
		);
		$home_view_middleware->verifyViewRequest();

		echo $blade->view()->make(
			'sections.home',
			$home_view_middleware->getViewConfig()
		)->render();
	}
);

/**
 * Show login view.
 */
$collection->get(
	'/login',
 	function () use ($router, $factory, $blade) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			$router->redirect('/');
		}

		$login_view_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\LoginViewMiddleware',
			$router
		);
		$login_view_middleware->verifyViewRequest();

		echo $blade->view()->make(
			'sections.login',
			$login_view_middleware->getViewConfig()
		)->render();
	}
);

/**
 * Login.
 */
$collection->post(
	'/login',
	function () use ($factory, $authenticator) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			return;
		}

		$login_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\LoginMiddleware',
			$authenticator
		);
		$login_middleware->login();
	}
);

/**
 * Show register view.
 */
$collection->get(
	'/register',
 	function () use ($router, $factory, $blade) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			$router->redirect('/');
		}

		$register_view_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\RegisterViewMiddleware',
			$router
		);
		$register_view_middleware->verifyViewRequest();

		echo $blade->view()->make(
			'sections.register',
			$register_view_middleware->getViewConfig()
		)->render();
	}
);

/**
 * Register.
 */
$collection->post(
	'/register',
	function () use ($factory, $authenticator) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			return;
		}

		$register_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\RegisterMiddleware',
			$authenticator
		);
		$register_middleware->register();
	}
);

/**
 * Validate registration form and give some feedback.
 */
$collection->put(
	'/register',
	function () use ($factory) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			return;
		}

		$registration_feedback_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\RegistrationFeedbackMiddleware'
		);
		$registration_feedback_middleware->validateRegistrationForm();
	}
);

/**
 * Logout.
 */
$collection->post(
	'/logout',
	function () use ($factory, $authenticator) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			return;
		}

		$logout_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Authentication\LogoutMiddleware',
			$authenticator
		);
		$logout_middleware->logout();
	}
);

/**
 * Activate email address.
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
			'\Povium\Route\Middleware\Authentication\EmailActivationMiddleware',
			$router,
			$authenticator->getCurrentUser()
		);
		$email_activation_middleware->activateEmail();
	},
	'email_activation'
);

/**
 * (Temp) Show email setting view.
 */
$collection->get(
	'/me/settings/email',
	function () use ($router) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			$router->redirect('/register', true);
		}

		//	@TODO: Render view
	}
);

/**
 * (Temp) Request email activation.
 *
 * "Get" is Test mode. Original is "post".
 */
$collection->get(
	'/me/settings/email/new-request',
	function () use ($factory, $authenticator, $router) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			return;
		}

		$email_activation_request_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Setting\EmailActivationRequestMiddleware',
			$router,
			$authenticator->getCurrentUser()
		);
		$email_activation_request_middleware->requestEmailActivation();
	}
);

/**
 * (Temp) Show editor view.
 */
$collection->get(
	'/editor',
 	function () use ($blade) {
		echo $blade->view()->make('sections.pvmeditor')->render();
	}
);

/**
 * (Temp) Show profile view.
 *
 * @param string $readable_id
 *
 * @throws NotFoundHttpException 	If nonexistent readable id
 */
$collection->get(
	'/@{readable_id:.+}',
	function ($readable_id) use ($factory, $blade) {
		$profile_view_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\User\ProfileViewMiddleware'
		);
		$profile_view_middleware->verifyViewRequest($readable_id);

		echo $blade->view()->make(
			'sections.profile',
			$profile_view_middleware->getViewConfig()
		)->render();
	},
	'profile'
);

/**
 * (Temp) Show post view.
 */
$collection->get(
	'/@{readable_id:.+}/{post_title:.+}-{post_id:\w+}',
 	function ($readable_id, $post_title, $post_id) use ($blade) {
		/* Middleware part */
		//	post_id에 해당하는 포스트가 있는지 체크
		//	없으면 return false
		//	있으면 포스트 작성자의 readable id와 포스트 타이틀을 가져옴
		//	대소문자 무시하고 가져온 readable id와 파라미터 readable_id 값을 비교
		//	대소문자 무시하고 가져온 title과 파라미터 title값을 비교 (가져온 title은 raw한 형태 -> 특문과 공백이 섞여있음)
		//	둘중 하나라도 다르면 올바른 uri로 redirect시킴
		//	둘다 같으면 포스트페이지 require
		require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/post.php');
	},
 	'post'
);

/**
 * Show http error view.
 *
 * User cannot directly access this route.
 * DO NOT GENERATE URI FOR THIS ROUTE.
 *
 * @param	int		$response_code	Http response code
 * @param	string	$title 			Http response title
 * @param	string	$heading		Http response heading
 * @param	string	$details		Http response details
 */
$collection->get(
	'/*',
	function ($response_code, $title, $heading, $details) use ($factory, $blade) {
		$http_error_view_middleware = $factory->createInstance(
			'\Povium\Route\Middleware\Error\HttpErrorViewMiddleware'
		);
		$http_error_view_middleware->verifyViewRequest($response_code, $title, $heading, $details);

		echo $blade->view()->make(
			'sections.http-error',
			$http_error_view_middleware->getViewConfig()
		)->render();
	},
	'http_error'
);
