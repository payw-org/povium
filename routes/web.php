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
$router->get(
	'/',
 	function () {
		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/home.php';
	}
);

/**
 * Login Page
 */
$router->get(
	'/login',
 	function () use ($auth, $redirector) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$redirector->redirect('/');
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
				$redirector->redirect('/login' . '?' . $prev_query);
			}
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/auth/login.php';
	}
);

/**
 * Regsiter Page
 */
$router->get(
	'/register',
 	function () use ($auth, $redirector) {
		//	If already logged in, send to home page.
		if ($auth->isLoggedIn()) {
			$redirector->redirect('/');
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
				$redirector->redirect('/register' . '?' . $prev_query);
			}
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/auth/register.php';
	}
);

/**
 * Editor test page
 */
$router->get(
	'/editor',
 	function () use ($auth, $redirector) {
		// //	If is not logged in, redirect to login page.
		// if (!$auth->isLoggedIn()) {
		// 	$redirector->redirect('/register', true);
		// }

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/editor.php';
	}
);

/**
 * User Profile Page
 *
 * @param string $readable_id
 *
 * @throws NotFoundHttpException If nonexistent readable id
 */
$router->get(
	'/@{readable_id:.+}',
 	function ($readable_id) use ($auth) {
		$readable_id = strtolower($readable_id);

		//	Nonexistent readable id.
		if (false === $user_id = $auth->getUserIdFromReadableId($readable_id)) {
			throw new NotFoundHttpException();
		}

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/user_home.php';
	},
	'user_profile'
);

/**
 * Post Page
 */
$router->get(
	'/@{readable_id:.+}/{post_title:.+}-{post_id:\d+}',
 	function ($readable_id, $post_title, $post_id) {
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
 * Email Setting Page
 */
$router->get(
	'/me/settings/email',
	function () use ($auth, $redirector) {
		//	If visitor is not logged in, redirect to register page.
		if (!$auth->isLoggedIn()) {
			$redirector->redirect('/register', true);
		}

		//	require page
	}
);

/**
 * Http Status Page
 *
 * User cannot directly access this route.
 * DO NOT GENERATE URI FOR THIS ROUTE.
 *
 * @param	int		$response_code	Http response code
 * @param	string	$title			Http response title
 * @param	string	$msg			Http response message
 * @param	string	$details		Http response details
 */
$router->get(
	'/*',
	function ($response_code, $title, $msg, $details) {
		http_response_code($response_code);

		require $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/http_error.php';
	},
	'http_error'
);
