<?php
/**
* Logout processing
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';
$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth', $with_db=true);

$logout_return = array('err' => false, 'msg' => '', 'redirect' => '');

$auth->logout();
$logout_return['redirect'] = '/';

echo json_encode($logout_return);
