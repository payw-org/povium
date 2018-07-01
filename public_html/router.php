<?php

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2)[0];

switch ($request_uri) {
	case '/':
		
		include "home.php";

		break;

	case '/register':
	case '/register/':
		
		include "register.php";

		break;

	case '/login':
	case '/login/':
		
		include "login.php";

		break;
	
	default:
		# code...
		break;
}

?>