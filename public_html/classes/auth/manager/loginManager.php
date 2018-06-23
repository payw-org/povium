<?php

/**
 *
 * Login manager
 * Connect login ajax with Auth class
 *
 */


require_once $_SERVER['DOCUMENT_ROOT'] . '/classes/AutoLoader.php';
$autoloader = new \povium\AutoLoader();
$autoloader->register();


$conn = \povium\conn\DBConnection::getInstance()->getConn();

$auth = new \povium\auth\Auth($conn);
$auth_config = require('./auth.config.php');


/* receive login inputs by ajax */
$login_inputs = json_decode($_POST['login_inputs'], TRUE);

$email = $login_inputs['email'];
$password = $login_inputs['password'];
$remember = $login_inputs['remember'];


#	$login_return = array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');
$login_return = array_merge($auth->login($email, $password, $remember), array('redirect' => ''));

if($login_return['err']) {		//	로그인 실패
	//	if inactive account,
	if($login_return['msg'] == $auth_config['msg']['account_inactive']){
	// TODO:	set redirect url to activate user account
	}
} else {							//	로그인 성공
	if(isset($_SESSION['before_page'])) {	//	직전 접속 페이지가 있으면 해당 url 리턴
		$login_return['redirect'] = $_SESSION['before_page'];
	}else {									//	없으면 홈 url 리턴
		$login_return['redirect'] = $_SERVER['DOCUMENT_ROOT'] . '/index.php';
	}
}

echo json_encode($login_return);

?>
