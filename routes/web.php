<?php
/**
* Set routes for web page.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use Povium\Base\Http\Exception\NotFoundHttpException;

/**
 * Home Page
 */
$collection->get(
	'/',
 	function () use ($template_engine) {
		$settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/home.php');
		$template_engine->render($settings['template_dir'], $settings['config']);
	}
);

/**
 * Login Page
 */
$collection->get(
	'/login',
 	function () use ($authenticator, $router, $template_engine) {
		//	If already logged in, send to home page.
		if ($authenticator->isLoggedIn()) {
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

		$settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/login.php');
		$template_engine->render($settings['template_dir'], $settings['config']);
	}
);

/**
 * Regsiter Page
 */
$collection->get(
	'/register',
 	function () use ($authenticator, $router, $template_engine) {
		//	If already logged in, send to home page.
		if ($authenticator->isLoggedIn()) {
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

		$settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/register.php');
		$template_engine->render($settings['template_dir'], $settings['config']);
	}
);

/**
 * Editor test page
 */
$collection->get(
	'/editor',
 	function () use ($template_engine) {
		$settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/editor.php');
		$template_engine->render($settings['template_dir'], $settings['config']);
	}
);

/**
 * User Profile Page
 *
 * @param string $readable_id
 *
 * @throws NotFoundHttpException If nonexistent readable id
 */
$collection->get(
	'/@{readable_id:.+}',
 	function ($readable_id) use ($authenticator, $template_engine) {
		$readable_id = strtolower($readable_id);

		//	Nonexistent readable id.
		if (false === $user_id = $authenticator->getUserManager()->getUserIDFromReadableID($readable_id)) {
			throw new NotFoundHttpException();
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/user_home.php';
	},
	'user_profile'
);

/**
 * Post Page
 */
$collection->get(
	'/@{readable_id:.+}/{post_title:.+}-{post_id:\w+}',
 	function ($readable_id, $post_title, $post_id) use ($template_engine) {
		//	post_id에 해당하는 포스트가 있는지 체크
		//	없으면 return false
		//	있으면 포스트 작성자의 readable id와 포스트 타이틀을 가져옴
		//	대소문자 무시하고 가져온 readable id와 파라미터 readable_id 값을 비교
		//	대소문자 무시하고 가져온 title과 파라미터 title값을 비교 (가져온 title은 raw한 형태 -> 특문과 공백이 섞여있음)
		//	둘중 하나라도 다르면 올바른 uri로 redirect시킴
		//	둘다 같으면 포스트페이지 require
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/post.php';
	},
 	'post'
);

/**
 * Email Setting Page(Tab)
 */
$collection->get(
	'/me/settings/email',
	function () use ($authenticator, $router, $template_engine) {
		//	If not logged in, redirect to register page.
		if (!$authenticator->isLoggedIn()) {
			$router->redirect('/register', true);
		}

		//	Render page
	}
);

/**
 * Http Status Page
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
	function ($response_code, $title, $heading, $details) use ($template_engine) {
		http_response_code($response_code);

		$settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_error.php');
		$template_engine->render($settings['template_dir'], $settings['config']);
	},
	'http_error'
);
