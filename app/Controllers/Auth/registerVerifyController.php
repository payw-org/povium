<?php
/**
* Receive register inputs and verify them.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth', $with_db=true);

/* receive register inputs by ajax */
$register_inputs = json_decode(file_get_contents('php://input'), true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];


$register_return = array('err' => false, 'readable_id_msg' => '', 'name_msg' => '',
'password_msg' => '');

$verify_readable_id = $auth->verifyReadableID($readable_id);
if ($verify_readable_id['err']) {
	$register_return['err'] = true;
	$register_return['readable_id_msg'] = $verify_readable_id['msg'];
}

$verify_name = $auth->verifyName($name);
if ($verify_name['err']) {
	$register_return['err'] = true;
	$register_return['name_msg'] = $verify_name['msg'];
}

$validate_password = $auth->validatePassword($password);
if ($validate_password['err']) {
	$register_return['err'] = true;
	$register_return['password_msg'] = $validate_password['msg'];
}

echo json_encode($register_return);
