<?php
/**
* Receive register inputs and validate them.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

global $factory, $auth;

//	Receive register inputs by ajax
$register_inputs = json_decode(file_get_contents('php://input'), true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];

$register_controller = $factory->createInstance('\Povium\Security\Auth\Controller\RegisterController', $auth);
$readable_id_validator = $register_controller->getReadableIDValidator();
$name_validator = $register_controller->getNameValidator();
$password_validator = $register_controller->getPasswordValidator();

$register_return = array(
	'readable_id_return' => [
		'err' => true,
		'msg' => ''
	],

	'name_return' => [
		'err' => true,
		'msg' => ''
	],

	'password_return' => [
		'err' => true,
		'msg' => '',
		'strength' => 0
	]
);

//	Validate readable id
$register_return['readable_id_return'] = $readable_id_validator->validate($readable_id, true);

//	Validate name
$register_return['name_return'] = $name_validator->validate($name, true);

//	Validate password
$register_return['password_return'] = $password_validator->validate($password);

if ($register_return['password_return']['err'] == false) {
	$register_return['password_return']['strength'] = $password_validator->getPasswordStrength($password);
}

echo json_encode($register_return);
