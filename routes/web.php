<?php
/**
* Set routes for web.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

use Povium\Security\Auth\Authorizer;
use Povium\Base\Http\Exception\HttpException;
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
			\Povium\Http\Middleware\Home\HomeViewMiddleware::class
		);
		$view_config = $home_view_middleware->requestViewConfig();

		echo $blade->view()->make(
			'sections.home',
			$view_config
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
			\Povium\Http\Middleware\Authentication\LoginViewMiddleware::class,
			$router
		);
		$view_config = $login_view_middleware->requestViewConfig();

		echo $blade->view()->make(
			'sections.login',
			$view_config
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
			\Povium\Http\Middleware\Authentication\LoginMiddleware::class,
			$authenticator
		);
		$login_middleware->login();
	}
);

/**
 * Validate login form and give some feedback.
 */
$collection->put(
	'/login',
	function() use ($factory) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			return;
		}

		$login_feedback_middleware = $factory->createInstance(
			\Povium\Http\Middleware\Authentication\LoginFeedbackMiddleware::class
		);
		$login_feedback_middleware->giveFeedback();
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
			\Povium\Http\Middleware\Authentication\RegisterViewMiddleware::class,
			$router
		);
		$view_config = $register_view_middleware->requestViewConfig();

		echo $blade->view()->make(
			'sections.register',
			$view_config
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
			\Povium\Http\Middleware\Authentication\RegisterMiddleware::class,
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
			\Povium\Http\Middleware\Authentication\RegistrationFeedbackMiddleware::class
		);
		$registration_feedback_middleware->giveFeedback();
	}
);

/**
 * Logout.
 */
$collection->get(
	'/logout',
	function () use ($router, $factory, $authenticator) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			$router->redirect('/');
		}

		$logout_middleware = $factory->createInstance(
			\Povium\Http\Middleware\Authentication\LogoutMiddleware::class,
			$router,
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
	function () use ($router, $factory) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			$router->redirect('/login', true);
		}

		$email_activation_middleware = $factory->createInstance(
			\Povium\Http\Middleware\Authentication\EmailActivationMiddleware::class,
			$router
		);
		$email_activation_middleware->activateEmail($GLOBALS['current_user']);
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
	function () use ($router, $factory) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			return;
		}

		$email_activation_request_middleware = $factory->createInstance(
			\Povium\Http\Middleware\Setting\EmailActivationRequestMiddleware::class,
			$router
		);
		$email_activation_request_middleware->requestEmailActivation($GLOBALS['current_user']);
	}
);

/**
 * (Temp) Show editor view.
 */
$collection->get(
	'/editor',
 	function () use ($blade) {
		echo $blade->view()->make(
			'sections.pvmeditor'
		)->render();
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
			\Povium\Http\Middleware\User\ProfileViewMiddleware::class
		);
		$view_config = $profile_view_middleware->requestViewConfig($readable_id);

		echo $blade->view()->make(
			'sections.profile',
			$view_config
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
 * @param	HttpException	$http_exception
 */
$collection->get(
	'/*',
	function ($http_exception) use ($factory, $blade) {
		$http_error_view_middleware = $factory->createInstance(
			\Povium\Http\Middleware\Error\HttpErrorViewMiddleware::class
		);
		$view_config = $http_error_view_middleware->requestViewConfig($http_exception);

		echo $blade->view()->make(
			'sections.http-error',
			$view_config
		)->render();
	},
	'http_error'
);
