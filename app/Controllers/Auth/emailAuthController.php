<?php
/**
* Verify that it is a valid email authentication link.
* If valid, registers the email and confirms that it is an authenticated user.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

global $router, $redirector, $auth;

//	Load http status messages
$http_status_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/http_status.php';

//	Fetch query params
$token = $_GET['token'];

//	Authenticate email address
$return = $auth->confirmEmailAuth($token);

switch ($return) {
	case 0:		//	NO ERROR
		$redirector->redirect('/');		#	홈에서 인증완료됨을 알리는 modal이 뜨도록 query params 추가하기

		break;
	case 1:		//	NONEXISTENT USER ID (410 ERROR)
		call_user_func(
			$router->getNamedRoutes()['ERR_410']->handler,
 			$http_status_config['410']['nonexistent_user_id']
		);

		break;
	case 2:		//	NOT MATCHED TOKEN (403 ERROR)
		call_user_func(
			$router->getNamedRoutes()['ERR_403']->handler,
 			$http_status_config['403']['not_matched_token']
		);

		break;
	case 3:		//	REQUEST EXPIRED (410 ERROR)
		call_user_func(
			$router->getNamedRoutes()['ERR_410']->handler,
 			$http_status_config['410']['request_expired']
		);

		break;
}
