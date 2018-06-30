<?php
/**
*
* Receive login inputs and process login.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
* @license MIT
*
*/


require_once $_SERVER['DOCUMENT_ROOT'] . '/classes/AutoLoader.php';
$autoloader = new \povium\AutoLoader();
$autoloader->register();
$factory = new \povium\factory\MasterFactory();


$auth = $factory->createInstance('\povium\auth\Auth');
$auth_config = require('./auth.config.php');

/* receive login inputs by ajax */
$login_inputs = json_decode($_POST['login_inputs'], true);
$email = $login_inputs['email'];
$password = $login_inputs['password'];
$remember = $login_inputs['remember'];


#	array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');
$login_return = array_merge($auth->login($email, $password, $remember), array('redirect' => ''));

if ($login_return['err']) {		//	failed to login
	//	if inactive account,
	if ($login_return['msg'] == $auth_config['msg']['account_inactive']) {
		// TODO:	set redirect url to activate user account
	}
} else {							//	login success
	if (isset($_SESSION['prev_page'])) {
		$login_return['redirect'] = $_SESSION['prev_page'];
	} else {
		$login_return['redirect'] = '/';
	}
}

echo json_encode($login_return);

?>
