<?php
/**
* Process logout.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

global $factory, $authenticator;

$logout_controller = $factory->createInstance('\Povium\Security\Authentication\Controller\LogoutController', $authenticator);

$logout_controller->logout();

#	array(
#		'err' => Whether an error occured,
#		'redirect' => redirect url
#	);
$logout_return['err'] = false;
$logout_return['redirect'] = '/';

echo json_encode($logout_return);
