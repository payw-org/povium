<?php
/**
* Mapping class type to responsible factory.
* $key : Fully qualified class name
* $value : Fully qualified factory name
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

return [
	'\Philo\Blade\Blade' => '\Povium\Base\Templating\Factory\BladeFactory',

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

	'\Povium\Http\Controller\Authentication\LoginController' => '\Povium\Http\Controller\Factory\LoginControllerFactory',
	'\Povium\Http\Controller\Authentication\LogoutController' => '\Povium\Http\Controller\Factory\LogoutControllerFactory',
	'\Povium\Http\Controller\Authentication\RegisterController' => '\Povium\Http\Controller\Factory\RegisterControllerFactory',
	'\Povium\Http\Controller\Authentication\EmailActivationController' => '\Povium\Http\Controller\Factory\EmailActivationControllerFactory',
	'\Povium\Http\Controller\Authentication\RegistrationFormValidationController' => '\Povium\Http\Controller\Factory\RegistrationFormValidationControllerFactory',
	'\Povium\Http\Controller\Authentication\LoginFormValidationController' => '\Povium\Http\Controller\Factory\LoginFormValidationControllerFactory',
	'\Povium\Http\Controller\Setting\EmailAddController' => '\Povium\Http\Controller\Factory\EmailAddControllerFactory',
	'\Povium\Http\Controller\User\ProfileViewController' => '\Povium\Http\Controller\Factory\ProfileViewControllerFactory',

    '\Povium\Http\Middleware\Authentication\LoginMiddleware' => '\Povium\Http\Middleware\Factory\LoginMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\RegisterMiddleware' => '\Povium\Http\Middleware\Factory\RegisterMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\RegistrationFeedbackMiddleware' => '\Povium\Http\Middleware\Factory\RegistrationFeedbackMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\LogoutMiddleware' => '\Povium\Http\Middleware\Factory\LogoutMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\EmailActivationMiddleware' => '\Povium\Http\Middleware\Factory\EmailActivationMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\LoginViewMiddleware' => '\Povium\Http\Middleware\Factory\LoginViewMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\RegisterViewMiddleware' => '\Povium\Http\Middleware\Factory\RegisterViewMiddlewareFactory',
	'\Povium\Http\Middleware\Authentication\LoginFeedbackMiddleware' => '\Povium\Http\Middleware\Factory\LoginFeedbackMiddlewareFactory',
	'\Povium\Http\Middleware\Setting\EmailActivationRequestMiddleware' => '\Povium\Http\Middleware\Factory\EmailActivationRequestMiddlewareFactory',
	'\Povium\Http\Middleware\Home\HomeViewMiddleware' => '\Povium\Http\Middleware\Factory\HomeViewMiddlewareFactory',
	'\Povium\Http\Middleware\User\ProfileViewMiddleware' => '\Povium\Http\Middleware\Factory\ProfileViewMiddlewareFactory',
	'\Povium\Http\Middleware\Error\HttpErrorViewMiddleware' => '\Povium\Http\Middleware\Factory\HttpErrorViewMiddlewareFactory',

	'\Povium\MailSender\ActivationMailSender' => '\Povium\MailSender\Factory\ActivationMailSenderFactory',


	'\Povium\Security\Auth\Authenticator' => '\Povium\Security\Auth\Factory\AuthenticatorFactory',

    '\Povium\Security\Auth\Authorizer' => '\Povium\Security\Auth\Factory\AuthorizerFactory',

	'\Povium\Security\Encoder\PasswordEncoder' => '\Povium\Security\Encoder\Factory\PasswordEncoderFactory',

	'\Povium\Security\User\UserManager' => '\Povium\Security\User\Factory\UserManagerFactory',

	'\Povium\Security\Validator\UserInfo\ReadableIDValidator' => '\Povium\Security\Validator\Factory\ReadableIDValidatorFactory',
	'\Povium\Security\Validator\UserInfo\EmailValidator' => '\Povium\Security\Validator\Factory\EmailValidatorFactory',
	'\Povium\Security\Validator\UserInfo\NameValidator' => '\Povium\Security\Validator\Factory\NameValidatorFactory',
	'\Povium\Security\Validator\UserInfo\PasswordValidator' => '\Povium\Security\Validator\Factory\PasswordValidatorFactory',
];
