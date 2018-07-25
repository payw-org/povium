<?php
/**
* Receive login inputs and process login.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

global $auth;

$auth_config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php');

/* Receive login inputs by ajax */
$login_inputs = json_decode(file_get_contents('php://input'), true);
$identifier = $login_inputs['identifier'];
$password = $login_inputs['password'];
$remember = $login_inputs['remember'];

if (isset($login_inputs['querystring'])) {
	parse_str($login_inputs['querystring'], $query_params);
}

#	array(
#		'err' => bool,
#		'msg' => 'err msg for display',
#		'redirect' => 'redirect url'
#	);
$login_return = array_merge($auth->login($identifier, $password, $remember), array('redirect' => ''));

if ($login_return['err']) {		//	failed to login
	//	If inactive account,
	if ($login_return['msg'] == $auth_config['msg']['account_inactive']) {
		// TODO:	set redirect url to activate user account
	}
} else {						//	login success
	if (isset($query_params['redirect'])) {
		$login_return['redirect'] = $query_params['redirect'];
	} else {
		$login_return['redirect'] = '/';
	}
}

echo json_encode($login_return);
