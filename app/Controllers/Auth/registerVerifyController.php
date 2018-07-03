<?php
/**
*
* Receive register inputs and verify them.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php'
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth');

/* receive register inputs by ajax */
$register_inputs = json_decode($_POST['register_inputs'], true);
$email = $register_inputs['email'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];


$register_return = array('err' => false, 'email_msg' => '', 'name_msg' => '',
'password_msg' => '');

$verify_email = $auth->verifyEmail($email);
if ($verify_email['err']) {
	$register_return['err'] = true;
	$register_return['email_msg'] = $verify_email['msg'];
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


?>
