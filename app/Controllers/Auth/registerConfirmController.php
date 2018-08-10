<?php
/**
* Receive register inputs and process register.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

global $redirector, $auth;

/* Receive register inputs by ajax */
$register_inputs = json_decode(file_get_contents('php://input'), true);
$readable_id = $register_inputs['readable_id'];
$name = $register_inputs['name'];
$password = $register_inputs['password'];

//	Get querystring of referer
$querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
if (isset($querystring)) {
	parse_str($querystring, $query_params);
}

#	$register_return = array(
#		'err' => bool,
#		'msg' => 'err msg for display',
#		'redirect' => 'redirect url'
#	);
$register_return = array_merge(
	$auth->register($readable_id, $name, $password),
 	array('redirect' => '')
);

if ($register_return['err']) {			//	failed to register

} else {								//	register success
	$auth->login($readable_id, $password, false);

	$register_return['redirect'] = '/';

	if (
		isset($query_params['redirect']) &&
		$redirector->verifyRedirectURI($query_params['redirect'])
	) {
		$register_return['redirect'] = $query_params['redirect'];
	}
}

echo json_encode($register_return);
