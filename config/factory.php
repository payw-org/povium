<?php
/**
* Mapping class type to responsible factory
* $key : Fully qualified class name
* $value : Fully qualified factory name
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'\Povium\Base\Factory\ServiceFactory' => [
		'\Povium\Base\Http\Session\PDOSessionHandler',
		'\Povium\Base\Http\Session\SessionManager',
		'\Povium\Base\Http\Client',
		'\Povium\Base\Routing\Validator\RedirectURIValidator',
		'\Povium\Base\Routing\Redirector',
		'\Povium\Base\Routing\Router',
		'\Povium\MailSender\ActivationMailSender',
		'\Povium\Generator\RandomStringGenerator',
		'\Povium\Security\User\UserProvider',
		'\Povium\Security\Encoder\PasswordEncoder',
		'\Povium\Security\Validator\UserInfo\ReadableIDValidator',
		'\Povium\Security\Validator\UserInfo\EmailValidator',
		'\Povium\Security\Validator\UserInfo\NameValidator',
		'\Povium\Security\Validator\UserInfo\PasswordValidator',
		'\Povium\Security\Auth\Auth',
		'\Povium\Security\Auth\Controller\LoginController',
		'\Povium\Security\Auth\Controller\LogoutController',
		'\Povium\Security\Auth\Controller\RegisterController',
		'\Povium\Security\Auth\Controller\EmailActivationController'
	]
];
