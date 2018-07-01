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

use Povium\Lib\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php'
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth\Auth');

$logout_return = array('err' => false, 'msg' => '', 'redirect' => '');

$auth->logout();
$logout_return['redirect'] = '/';

echo json_encode($logout_return);

?>
