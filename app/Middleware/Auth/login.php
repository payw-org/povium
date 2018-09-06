<?php
/**
* Receive login inputs and process login.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

global $redirector, $auth;

$auth_config = require $_SERVER['DOCUMENT_ROOT'] . '/../config/auth.php';

//	Receive login inputs by ajax
$login_inputs = json_decode(file_get_contents('php://input'), true);
$identifier = $login_inputs['identifier'];
$password = $login_inputs['password'];

//	Get querystring of referer
$querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
if (isset($querystring)) {
	parse_str($querystring, $query_params);
}

#	array(
#		'err' => bool,
#		'msg' => err msg for display,
#		'redirect' => redirect url (optional param)
#	);
$login_return = $auth->login($identifier, $password);

if ($login_return['err']) {		//	Login fail
	switch ($login_return['msg']) {
		case $auth_config['msg']['account_is_deleted']:
			//	@TODO	Set redirect url to cancel account deletion.

			break;
		case $auth_config['msg']['account_inactive']:
			//	@TODO	Set redirect url to reactivate user account.

			break;
		case $auth_config['msg']['issuing_access_key_err'];
			//	@TODO	Ask the user for understanding

			break;
	}
} else {						//	Login success
	$login_return['redirect'] = '/';

	if (
		isset($query_params['redirect']) &&
		$redirector->validateRedirectURI($query_params['redirect'])
	) {
		$login_return['redirect'] = $query_params['redirect'];
	}
}

echo json_encode($login_return);
