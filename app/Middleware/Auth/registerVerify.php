<?php
/**
* Receive register inputs and verify them.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

use ZxcvbnPhp\Zxcvbn;

global $auth;

/* Receive register inputs by ajax */
$register_inputs = json_decode(file_get_contents('php://input'), true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];


$register_return = array(
	'readable_id_return' => [
		'err' => false,
		'msg' => ''
	],

	'name_return' => [
		'err' => false,
		'msg' => ''
	],

	'password_return' => [
		'err' => false,
		'msg' => '',
		'strength' => 0
	]
);

//	Verify readable id
$verify_readable_id = $auth->verifyReadableID($readable_id);
if ($verify_readable_id['err']) {
	$register_return['readable_id_return']['err'] = true;
	$register_return['readable_id_return']['msg'] = $verify_readable_id['msg'];
}

//	Verify name
$verify_name = $auth->verifyName($name);
if ($verify_name['err']) {
	$register_return['name_return']['err'] = true;
	$register_return['name_return']['msg'] = $verify_name['msg'];
}

//	Verify password
$validate_password = $auth->validatePassword($password);
if ($validate_password['err']) {
	$register_return['password_return']['err'] = true;
	$register_return['password_return']['msg'] = $validate_password['msg'];
} else {
	//	Calculate password strength
	$zxcvbn = new Zxcvbn();
	$score = $zxcvbn->passwordStrength($password)['score'];
	if ($score <= 1) {			//	weak password
		$register_return['password_return']['strength'] = 0;
	} else if ($score <= 3) {	//	normal password
		$register_return['password_return']['strength'] = 1;
	} else {					//	safe password
		$register_return['password_return']['strength'] = 2;
	}
}

echo json_encode($register_return);
