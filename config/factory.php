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
	'\Povium\Base\Database\DBBuilder' => '\Povium\Base\Database\Factory\DBBuilderFactory',

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

	'\Povium\Security\Authentication\Authenticator' => '\Povium\Security\Authentication\Factory\AuthenticatorFactory',
	'\Povium\Security\Authentication\Controller\LoginController' => '\Povium\Security\Authentication\Factory\LoginControllerFactory',
	'\Povium\Security\Authentication\Controller\LogoutController' => '\Povium\Security\Authentication\Factory\LogoutControllerFactory',
	'\Povium\Security\Authentication\Controller\RegisterController' => '\Povium\Security\Authentication\Factory\RegisterControllerFactory',
	'\Povium\Security\Authentication\Controller\EmailAddController' => '\Povium\Security\Authentication\Factory\EmailAddControllerFactory',
	'\Povium\Security\Authentication\Controller\EmailActivationController' => '\Povium\Security\Authentication\Factory\EmailActivationControllerFactory',

	'\Povium\Security\Encoder\PasswordEncoder' => '\Povium\Security\Encoder\Factory\PasswordEncoderFactory',

	'\Povium\Security\User\UserManager' => '\Povium\Security\User\Factory\UserManagerFactory',

	'\Povium\Security\Validator\UserInfo\ReadableIDValidator' => '\Povium\Security\Validator\Factory\ReadableIDValidatorFactory',
	'\Povium\Security\Validator\UserInfo\EmailValidator' => '\Povium\Security\Validator\Factory\EmailValidatorFactory',
	'\Povium\Security\Validator\UserInfo\NameValidator' => '\Povium\Security\Validator\Factory\NameValidatorFactory',
	'\Povium\Security\Validator\UserInfo\PasswordValidator' => '\Povium\Security\Validator\Factory\PasswordValidatorFactory',
];
