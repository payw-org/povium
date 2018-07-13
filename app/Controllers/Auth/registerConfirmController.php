<?php
/**
*
* Receive register inputs and process register.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth');

/* receive register inputs by ajax */
$register_inputs = json_decode($_POST['register_inputs'], true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];

#	$register_return = array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');
$register_return = array_merge($auth->register($readable_id, $name, $password), array('redirect' => ''));

if ($register_return['err']) {			//	failed to register

} else {								//	register success
	$auth->login($readable_id, $password, false);
	$register_return['redirect'] = '/';
}

echo json_encode($register_return);
