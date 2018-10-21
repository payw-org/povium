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

$current_user = $auth->getCurrentUser();

#	array(
#		'err' => bool,
#		'code' => err code,
#		'msg' => err message
#	);
$return = $email_activation_controller->activateEmail($current_user, $token);

if ($return['err']) {	//	Failed to activate email address
	switch ($return['code']) {
		case $email_activation_controller->getConfig()['err']['user_not_found']['code']:
			throw new GoneHttpException($return['msg']);

			break;
		case $email_activation_controller->getConfig()['err']['token_not_match']['code']:
			throw new ForbiddenHttpException($return['msg']);

			break;
		case $email_activation_controller->getConfig()['err']['request_expired']['code']:
			throw new GoneHttpException($return['msg']);

			break;
	}
} else {				//	Successfully activated email address
	$router->redirect('/');		#	홈에서 인증완료됨을 알리는 modal이 뜨도록 query params 추가하기
}
