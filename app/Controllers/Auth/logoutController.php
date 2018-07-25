<?php
/**
* Logout processing
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

global $auth;

$logout_return = array(
	'err' => false,
	'msg' => '',
	'redirect' => ''
);

$auth->logout();
$logout_return['redirect'] = '/';

echo json_encode($logout_return);
