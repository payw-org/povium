<?php
/**
* Logout processing
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

global $auth;

$auth->logout();

#	array(
#		'err' => Whether an error occured,
#		'redirect' => redirect url
#	);
$logout_return['err'] = false;
$logout_return['redirect'] = '/';

echo json_encode($logout_return);
