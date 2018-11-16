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
 * Show home page.
 */
$collection->get(
	'/',
 	function () use ($blade) {
		$config = array(
			"posts" => [
				[
					"img" => "macbookpro2018",
					"title" => "2018년 맥북프로는 너무 뜨거워",
					"editor" => "앤소니"
				],
				[
					"img" => "spongebob",
					"title" => "내가 귀여운 이유",
					"editor" => "최홍ZUNE"
				],
				[
					"img" => "programmer",
					"title" => "프로그래머처럼 생각해야 한다",
					"editor" => "황장병치훈"
				],
				[
					"img" => "1",
					"title" => "장어덮밥을 먹을 수 없게 된다면?",
					"editor" => "박진둘"
				],
				[
					"img" => "2",
					"title" => "'동네다움'을 지킬 수 있는 방법",
					"editor" => "장준끼"
				],
				[
					"img" => "3",
					"title" => "여행하며 '현금 관리'를 잘 하는 방법",
					"editor" => "장햄"
				],
				[
					"img" => "4",
					"title" => "필름카메라의 번거러움이 좋다",
					"editor" => "청춘나지훈"
				],
				[
					"img" => "5",
					"title" => "가짜 어른 구별하는 힘을 기르는 방법",
					"editor" => "조경상병훈"
				],
				[
					"img" => "6",
					"title" => "사진을 시작한 사람들이 앓는다는 '장비병'",
					"editor" => "쿠형"
				]
			]
		);
		
		echo $blade->view()->make('sections.home', $config)->render();
	}
);

/**
 * Show login form page.
 */
$collection->get(
	'/login',
 	function () use ($router, $blade) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			$router->redirect('/');
		}

		//	If referer is register page
		if (
			isset($_SERVER['HTTP_REFERER']) &&
 			'/register' == parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH)
		) {
			$prev_query = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
			$curr_query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);

			if (isset($prev_query) && !isset($curr_query)) {
				//	Concatenate referer's query to current uri.
				//	Then redirect.
				$router->redirect('/login' . '?' . $prev_query);
			}
		}

		echo $blade->view()->make('sections.login')->render();
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
 * Show register form page.
 */
$collection->get(
	'/register',
 	function () use ($router, $blade) {
		if ($GLOBALS['authority'] >= Authorizer::USER) {
			$router->redirect('/');
		}

		//	If referer is login page
		if (
			isset($_SERVER['HTTP_REFERER']) &&
 			'/login' == parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH)
		) {
			$prev_query = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
			$curr_query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
			if (isset($prev_query) && !isset($curr_query)) {
				//	Concatenate referer's query to current uri.
				//	Then redirect.
				$router->redirect('/register' . '?' . $prev_query);
			}
		}

		echo $blade->view()->make('sections.register')->render();
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
 * (Test) Show email setting page.
 */
$collection->get(
	'/me/settings/email',
	function () use ($router) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
			$router->redirect('/register', true);
		}

		//	Render page
	}
);

/**
 * (Test) Request email activation.
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
			'\Povium\Route\Middleware\Authentication\EmailActivationRequestMiddleware',
			$router,
			$authenticator->getCurrentUser()
		);
		$email_activation_request_middleware->requestEmailActivation();
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
 * (Test) Show editor page.
 */
$collection->get(
	'/editor',
 	function () use ($blade) {
		echo $blade->view()->make('sections.pvmeditor')->render();
	}
);

/**
 * (Test) Show profile page.
 *
 * @param string $readable_id
 *
 * @throws NotFoundHttpException 	If nonexistent readable id
 */
$collection->get(
	'/@{readable_id:.+}',
 	function ($readable_id) use ($blade) {
		$readable_id = strtolower($readable_id);

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Route/Middleware/User/userProfile.php');

		echo $blade->view()->make('sections.profile-home')->render();
	},
	'user_profile'
);

/**
 * (Test) Show post page.
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
 * Show http status page.
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
	function ($response_code, $title, $heading, $details) use ($blade) {
		http_response_code($response_code);

		$config = array(
			'title' => $title,
			'heading' => $heading,
			'details' => $details
		);

		echo $blade->view()->make('sections.http-error', $config)->render();
	},
	'http_error'
);
