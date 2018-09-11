<?php
/**
* Validate email activation link.
* If valid, activate the email address.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

use Povium\Base\Http\Exception\UnauthorizedHttpException;
use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

global $redirector, $auth;

$auth_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php';
$http_response_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php';

//	Fetch query params
if (!isset($_GET['token'])) {
	throw new ForbiddenHttpException();
}

$token = $_GET['token'];

#	array(
#		'err' => bool,
#		'code' => err code,
#	);
$return = $auth->activateEmailAddress($token);

if ($return['err']) {	//	Failed to activate email address
	switch ($return['code']) {
		case $auth_config['err']['code']['not_logged_in']:
			throw new UnauthorizedHttpException();

			break;

		case $auth_config['err']['code']['user_not_found']:
			throw new GoneHttpException($http_response_config['410']['details']['user_not_found']);

			break;

		case $auth_config['err']['code']['token_not_match']:
			throw new ForbiddenHttpException($http_response_config['403']['details']['token_not_match']);

			break;

		case $auth_config['err']['code']['request_expired']:
			throw new GoneHttpException($http_response_config['410']['details']['request_expired']);

			break;
	}
} else {				//	Successfully activated email address
	$redirector->redirect('/');		#	홈에서 인증완료됨을 알리는 modal이 뜨도록 query params 추가하기
}
