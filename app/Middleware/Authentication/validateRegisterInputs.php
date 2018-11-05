<?php
/**
* Receive register inputs and validate them.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

global $factory;

//	Receive register inputs by ajax
$register_inputs = json_decode(file_get_contents('php://input'), true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];

$readable_id_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\ReadableIDValidator');
$name_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\NameValidator');
$password_validator = $factory->createInstance('\Povium\Security\Validator\UserInfo\PasswordValidator');

$return = array(
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
$return['readable_id_return'] = $readable_id_validator->validate($readable_id, true);

//	Validate name
$return['name_return'] = $name_validator->validate($name, true);

//	Validate password
$return['password_return'] = $password_validator->validate($password);

if ($return['password_return']['err'] == false) {
	$return['password_return']['strength'] = $password_validator->getPasswordStrength($password);
}

echo json_encode($return);
