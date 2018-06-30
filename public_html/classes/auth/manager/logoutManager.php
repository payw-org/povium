<?php
/**
*
* Logout processing
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

$logout_return = array('err' => false, 'msg' => '', 'redirect' => '');

$auth->logout();
$logout_return['redirect'] = '/';

echo json_encode($logout_return);

?>
