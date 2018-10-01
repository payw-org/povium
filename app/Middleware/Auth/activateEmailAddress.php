<?php
/**
* Validate email activation link.
* If valid, activate the email address.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

global $factory, $auth, $router;

//	Fetch query params
if (!isset($_GET['token'])) {
	throw new ForbiddenHttpException();
}

$token = $_GET['token'];

$email_activation_controller = $factory->createInstance('\Povium\Security\Auth\Controller\EmailActivationController', $auth);
$http_response_config = $router->getHttpResponseConfig();

#	array(
#		'err' => bool,
#		'code' => err code,
#	);
$return = $email_activation_controller->activateEmailAddress($token);

if ($return['err']) {	//	Failed to activate email address
	switch ($return['code']) {
		case $email_activation_controller->getConfig()['code']['not_logged_in']:
			break;
		case $email_activation_controller->getConfig()['code']['user_not_found']:
			throw new GoneHttpException($http_response_config['410']['details']['user_not_found']);

			break;
		case $email_activation_controller->getConfig()['code']['token_not_match']:
			throw new ForbiddenHttpException($http_response_config['403']['details']['token_not_match']);

			break;
		case $email_activation_controller->getConfig()['code']['request_expired']:
			throw new GoneHttpException($http_response_config['410']['details']['request_expired']);

			break;
	}
} else {				//	Successfully activated email address
	$router->redirect('/');		#	홈에서 인증완료됨을 알리는 modal이 뜨도록 query params 추가하기
}
