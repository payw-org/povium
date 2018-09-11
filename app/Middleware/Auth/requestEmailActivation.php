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
$auth_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php';

//	Receive email address by ajax
# $email = json_decode(file_get_contents('php://input'), true)['email'];
$email = '1000jaman@naver.com';

//	Generate authentication token
$token = $auth->generateUuidV4();

#	array(
#		'err' => bool,
#		'msg' => err msg for display,
#	);
$return = $auth->addNewEmailAddress($email, $token);

if ($return['err']) {	//	Failed to add new email address

} else {				//	Successfully added new email address
	//	Generate email activation link
	$activation_link =
		BASE_URI .
		$router->generateURI('email_activation') .
		'?' . http_build_query(array('token' => $token));

	//	Failed to send activation email
	if (!$mail_sender->sendEmail($email, $activation_link)) {
		$return['err'] = true;
		$return['msg'] = $auth_config['msg']['activation_email_err'];
	}
}

echo json_encode($return);
