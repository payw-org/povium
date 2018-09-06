<?php
/**
* Verify that it is a valid email activation link.
* If valid, activate the email address.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

global $redirector, $auth;

//	Load http status messages
$http_response_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php';

//	Fetch query params
$token = $_GET['token'];

//	Activate email
$return = $auth->verifyEmailAuth($token);

switch ($return) {
	case 0:		//	NO ERROR
		$redirector->redirect('/');		#	홈에서 인증완료됨을 알리는 modal이 뜨도록 query params 추가하기

		break;
	case 1:		//	NONEXISTENT USER ID (410 ERROR)
		throw new GoneHttpException($http_response_config['410']['details']['nonexistent_user_id']);

		break;
	case 2:		//	NOT MATCHED TOKEN (403 ERROR)
		throw new ForbiddenHttpException($http_response_config['403']['details']['not_matched_token']);

		break;
	case 3:		//	REQUEST EXPIRED (410 ERROR)
		throw new GoneHttpException($http_response_config['410']['details']['request_expired']);

		break;
}
