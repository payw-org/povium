<?php
/**
* Receive login inputs and process login.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

global $factory, $authenticator;

//	Receive login inputs by ajax
$login_inputs = json_decode(file_get_contents('php://input'), true);
$identifier = $login_inputs['identifier'];
$password = $login_inputs['password'];

//	Get querystring of referer
$querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
if (isset($querystring)) {
	parse_str($querystring, $query_params);
}

$login_controller = $factory->createInstance('\Povium\Security\Authentication\Controller\LoginController', $authenticator);
$redirect_uri_validator = $factory->createInstance('\Povium\Base\Routing\Validator\RedirectURIValidator');

#	array(
#		'err' => bool,
#		'msg' => err msg for display,
#		'redirect' => redirect url (optional param)
#	);
$return = $login_controller->login($identifier, $password);

if ($return['err']) {		//	Login fail
	switch ($return['msg']) {
		case  $login_controller->getConfig()['msg']['account_inactive']:
			//	@TODO	Set redirect url to reactivate user account.

			break;
	}
} else {		//	Login success
	$return['redirect'] = '/';

	if (
		isset($query_params['redirect']) &&
		$redirect_uri_validator->validate($query_params['redirect'])
	) {
		$return['redirect'] = $query_params['redirect'];
	}
}

echo json_encode($return);
