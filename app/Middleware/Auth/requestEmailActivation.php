<?php
/**
* Request email activation.
* @TODO	Check get email address case sensitive or insensitive
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

global $factory, $router, $auth;

$mail_sender = $factory->createInstance('\Povium\MailSender\ActivationMailSender');

//	Receive input email by ajax
# $email = json_decode(file_get_contents('php://input'), true);
$email = '1000jaman@naver.com';

#	array(
#		'err' => bool,
#		'msg' => err msg for display,
#	);
$send_email_return = $auth->validateEmail($email, true);

if ($send_email_return['err']) {	//	This email is not possible to authenticate

} else {						//	Valid email.
	//	Generate token for authentication.
	$token = $auth->generateUuidV4();

	if ($auth->requestEmailAuth($email, $token)) {
		$auth_uri =
			BASE_URI .
			$router->generateURI('email_authentication') .
			'?' . http_build_query(array('token' => $token));

		//	Send activation email.
		$mail_sender->sendEmail($email, $auth_uri);
	}
}

echo json_encode($send_email_return);
