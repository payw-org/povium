<?php
/**
* Verify that it is a valid email authentication link.
* If valid, registers the email and confirms that it is an authenticated user.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

global $auth;

$sid = $_GET['sid'];
$token = $_GET['token'];

$return = $auth->requestEmailAuth($sid, $token);

switch ($return) {
	case 0:		//	NO ERROR
		
		break;
	case 1:		//	NOT MATCH. SID OR TOKEN IS MODIFIED

		break;
	case 2:		//	REQUEST EXPIRED

		break;
}
