<?php
/**
* Set routes for web page.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use Povium\Security\Authorization\Authorizer;
use Povium\Base\Http\Exception\NotFoundHttpException;

/**
 * Home Page
 */
$collection->get(
	'/',
 	function () use ($template_engine, $blade) {
		$config = array(
			"title" => "Povium | 좋은 글, 세상을 바꾸는 힘",
		
			"post_img_link" => [
				"macbookpro2018", "spongebob", "programmer", "1", "2" , "3", "4", "5", "6"
			],
		
			"post_title" => [
				"2018년 맥북프로는 너무 뜨거워",
				"내가 귀여운 이유",
				"프로그래머처럼 생각해야 한다",
				"장어덮밥을 먹을 수 없게 된다면?",
				"'동네다움'을 지킬 수 있는 방법",
				"여행하며 '현금 관리'를 잘 하는 방법",
				"필름카메라의 번거러움이 좋다",
				"가짜 어른 구별하는 힘을 기르는 방법",
				"사진을 시작한 사람들이 앓는다는 '장비병'"
			],
		
			"post_writer" => [
				"앤소니", "최홍ZUNE", "황장병치훈", "박진둘", "장준끼", "장햄", "청춘나지훈", "조경상병훈", "쿠형"
			]
		);
		
		echo $blade->view()->make('sections.home', $config)->render();
		// $view_settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/home.php');
		// $template_engine->render($view_settings['template_dir'], $view_settings['config']);
	}
);

/**
 * Login Page
 */
$collection->get(
	'/login',
 	function () use ($router, $template_engine, $blade) {
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

		// $view_settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/login.php');
		// $template_engine->render($view_settings['template_dir'], $view_settings['config']);
		echo $blade->view()->make('sections.login')->render();

	}
);

/**
 * Register Page
 */
$collection->get(
	'/register',
 	function () use ($router, $template_engine, $blade) {
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

		// $view_settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/register.php');
		// $template_engine->render($view_settings['template_dir'], $view_settings['config']);
		echo $blade->view()->make('sections.register')->render();
	}
);

/**
 * Editor test page
 */
$collection->get(
	'/editor',
 	function () use ($template_engine, $blade) {
		// $view_settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/editor.php');
		// $template_engine->render($view_settings['template_dir'], $view_settings['config']);
		echo $blade->view()->make('sections.pvmeditor')->render();
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
 	function ($readable_id) use ($template_engine) {
		$readable_id = strtolower($readable_id);

		require($_SERVER['DOCUMENT_ROOT'] . '/../app/Middleware/View/userProfile.php');

		require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/user_profile.php');
	},
	'user_profile'
);

/**
 * Post Page
 */
$collection->get(
	'/@{readable_id:.+}/{post_title:.+}-{post_id:\w+}',
 	function ($readable_id, $post_title, $post_id) use ($template_engine) {
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
 * Email Setting Page(Tab)
 */
$collection->get(
	'/me/settings/email',
	function () use ($router, $template_engine) {
		if ($GLOBALS['authority'] == Authorizer::VISITOR) {
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

		$view_settings = require($_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_error.php');
		$template_engine->render($view_settings['template_dir'], $view_settings['config']);
	},
	'http_error'
);
