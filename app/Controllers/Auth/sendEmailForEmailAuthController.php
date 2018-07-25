<?php
/**
* Receive input email address
* and send email for user's email address authentication.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

global $factory, $router, $auth;

$mailer = $factory->createInstance('\Povium\Mailer', $with_db=false);

/* Receive input email by ajax */
// $email = json_decode(file_get_contents('php://input'), true);
$email = '1000jaman@naver.com';

#	$send_mail_return = array(
#		'err' => bool,
#		'msg' => 'err msg for display'
#	);
$send_mail_return = $auth->verifyEmail($email);

if ($send_mail_return['err']) {		//	This email is not possible to authenticate

} else {	//	Valid email. Send mail for email authentication.
	$sid = $auth->generateRandomHash(8);
	$token = $auth->uuidV4();

	if ($auth->addEmailForWaiting($email, $sid, $token)) {
		$auth_uri =
			BASE_URI .
			$router->generateURI('email_authentication') .
			'?' . http_build_query(array('sid' => $sid, 'token' => $token));
		$mailer->sendEmailForEmailAuth($email, $auth_uri);
	}
}

echo json_encode($send_mail_return);
