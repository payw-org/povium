<?php
/**
* Receive login inputs and process login.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth');
$auth_config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');

/* receive login inputs by ajax */
$login_inputs = json_decode(file_get_contents('php://input'), true);
$identifier = $login_inputs['identifier'];
$password = $login_inputs['password'];
$remember = $login_inputs['remember'];


#	array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');
$login_return = array_merge($auth->login($identifier, $password, $remember), array('redirect' => ''));

if ($login_return['err']) {		//	failed to login
	//	if inactive account,
	if ($login_return['msg'] == $auth_config['msg']['account_inactive']) {
		// TODO:	set redirect url to activate user account
	}
} else {						//	login success
	if (isset($_SESSION['prev_page'])) {
		$login_return['redirect'] = $_SESSION['prev_page'];
	} else {
		$login_return['redirect'] = '/';
	}
}

echo json_encode($login_return);
