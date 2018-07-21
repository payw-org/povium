<?php
/**
* Receive input email
* and send mail for email authentication.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

use Povium\Base\Factory\MasterFactory;

require_once $_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php';

$factory = new MasterFactory();

$auth = $factory->createInstance('\Povium\Auth', $with_db=true);

/* Receive input email by ajax */
$email = json_decode(file_get_contents('php://input'), true);
