<?php
/**
* Receive register inputs and validate them.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

global $auth;

//	Receive register inputs by ajax
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

//	Validate readable id
$register_return['readable_id_return'] = $auth->validateReadableId($readable_id, true);

//	Validate name
$register_return['name_return'] = $auth->validateName($name, true);

//	Validate password
$register_return['password_return'] = $auth->validatePassword($password);

if ($register_return['password_return']['err'] == false) {
	$register_return['password_return']['strength'] = $auth->getPasswordStrength($password);
}

echo json_encode($register_return);
