<?php
/**
* Receive login inputs and process login.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

global $factory, $auth;

//	Receive login inputs by ajax
$login_inputs = json_decode(file_get_contents('php://input'), true);
$identifier = $login_inputs['identifier'];
$password = $login_inputs['password'];

//	Get querystring of referer
$querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
if (isset($querystring)) {
	parse_str($querystring, $query_params);
}

$login_controller = $factory->createInstance('\Povium\Security\Auth\Controller\LoginController', $auth);
$redirect_uri_validator = $factory->createInstance('\Povium\Base\Routing\Validator\RedirectURIValidator');

#	array(
#		'err' => bool,
#		'msg' => err msg for display,
#		'redirect' => redirect url (optional param)
#	);
$login_return = $login_controller->login($identifier, $password);

if ($login_return['err']) {		//	Login fail
	switch ($login_return['msg']) {
		case $login_controller->getConfig()['msg']['account_is_deleted']:
			//	@TODO	Set redirect url to cancel account deletion.

			break;
		case  $login_controller->getConfig()['msg']['account_inactive']:
			//	@TODO	Set redirect url to reactivate user account.

			break;
		case  $login_controller->getConfig()['msg']['issuing_access_key_err'];
			//	@TODO	Ask the user for understanding

			break;
	}
} else {						//	Login success
	$login_return['redirect'] = '/';

	if (
		isset($query_params['redirect']) &&
		$redirect_uri_validator->validate($query_params['redirect'])
	) {
		$login_return['redirect'] = $query_params['redirect'];
	}
}

echo json_encode($login_return);
