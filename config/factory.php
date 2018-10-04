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
	'\Povium\Base\Http\Client' => '\Povium\Base\Http\Factory\ClientFactory',
	'\Povium\Base\Http\Session\PDOSessionHandler' => '\Povium\Base\Http\Factory\PDOSessionHandlerFactory',
	'\Povium\Base\Http\Session\SessionManager' => '\Povium\Base\Http\Factory\SessionManagerFactory',

	'\Povium\Base\Routing\Router' => '\Povium\Base\Routing\Factory\RouterFactory',
	'\Povium\Base\Routing\RouteCollection' => '\Povium\Base\Routing\Factory\RouteCollectionFactory',
	'\Povium\Base\Routing\Matcher\RequestMatcher' => '\Povium\Base\Routing\Factory\RequestMatcherFactory',
	'\Povium\Base\Routing\Generator\URIGenerator' => '\Povium\Base\Routing\Factory\URIGeneratorFactory',
	'\Povium\Base\Routing\Redirector\Redirector' => '\Povium\Base\Routing\Factory\RedirectorFactory',
	'\Povium\Base\Routing\Validator\RedirectURIValidator' => '\Povium\Base\Routing\Factory\RedirectURIValidatorFactory',

	'\Povium\Base\Templating\TemplateEngine' => '\Povium\Base\Templating\Factory\TemplateEngineFactory',

	'\Povium\Generator\RandomStringGenerator' => '\Povium\Generator\Factory\RandomStringGeneratorFactory',

	'\Povium\MailSender\ActivationMailSender' => '\Povium\MailSender\Factory\ActivationMailSenderFactory',

	'\Povium\Security\Auth\Auth' => '\Povium\Security\Auth\Factory\AuthFactory',
	'\Povium\Security\Auth\Controller\LoginController' => '\Povium\Security\Auth\Factory\LoginControllerFactory',
	'\Povium\Security\Auth\Controller\LogoutController' => '\Povium\Security\Auth\Factory\LogoutControllerFactory',
	'\Povium\Security\Auth\Controller\RegisterController' => '\Povium\Security\Auth\Factory\RegisterControllerFactory',
	'\Povium\Security\Auth\Controller\EmailActivationController' => '\Povium\Security\Auth\Factory\EmailActivationControllerFactory',

	'\Povium\Security\Encoder\PasswordEncoder' => '\Povium\Security\Encoder\Factory\PasswordEncoderFactory',

	'\Povium\Security\User\UserProvider' => '\Povium\Security\User\Factory\UserProviderFactory',

	'\Povium\Security\Validator\UserInfo\ReadableIDValidator' => '\Povium\Security\Validator\Factory\ReadableIDValidatorFactory',
	'\Povium\Security\Validator\UserInfo\EmailValidator' => '\Povium\Security\Validator\Factory\EmailValidatorFactory',
	'\Povium\Security\Validator\UserInfo\NameValidator' => '\Povium\Security\Validator\Factory\NameValidatorFactory',
	'\Povium\Security\Validator\UserInfo\PasswordValidator' => '\Povium\Security\Validator\Factory\PasswordValidatorFactory',
];
