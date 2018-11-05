<?php
/**
* Validate email activation link.
* If valid, activate the email address.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

use Povium\Security\Authentication\Controller\EmailActivationController;
use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

global $factory, $authenticator, $router;

//	Fetch query params
if (!isset($_GET['token'])) {
	throw new ForbiddenHttpException();
}

$token = $_GET['token'];

$email_activation_controller = $factory->createInstance('\Povium\Security\Authentication\Controller\EmailActivationController');

$current_user = $authenticator->getCurrentUser();

#	array(
#		'err' => bool,
#		'code' => err code,
#		'msg' => err message
#	);
$return = $email_activation_controller->activateEmail($current_user, $token);

if ($return['err']) {	//	Failed to activate email address
	switch ($return['code']) {
		case EmailActivationController::USER_NOT_FOUND:
			throw new GoneHttpException($return['msg']);

			break;
		case EmailActivationController::TOKEN_NOT_MATCH:
			throw new ForbiddenHttpException($return['msg']);

			break;
		case EmailActivationController::REQUEST_EXPIRED:
			throw new GoneHttpException($return['msg']);

			break;
	}
} else {	//	Successfully activated email address
	$router->redirect('/');		// @TODO: 홈에서 인증완료됨을 알리는 modal이 뜨도록 query 추가하기
}
