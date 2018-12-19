<?php
/**
* Mapping class type to responsible factory.
* $key : Fully qualified class name
* $value : Fully qualified factory name
*
* @author 		H.Chihoon
* @copyright 	2018 Povium
*/

return [
	\Philo\Blade\Blade::class => \Readigm\Base\Templating\Factory\BladeFactory::class,

	\Readigm\Base\Database\DBBuilder::class => \Readigm\Base\Database\Factory\DBBuilderFactory::class,

	\Readigm\Base\Http\Client::class => \Readigm\Base\Http\Factory\ClientFactory::class,
	\Readigm\Base\Http\Session\PDOSessionHandler::class => \Readigm\Base\Http\Factory\PDOSessionHandlerFactory::class,
	\Readigm\Base\Http\Session\SessionManager::class => \Readigm\Base\Http\Factory\SessionManagerFactory::class,

	\Readigm\Base\Routing\Router::class => \Readigm\Base\Routing\Factory\RouterFactory::class,
	\Readigm\Base\Routing\RouteCollection::class => \Readigm\Base\Routing\Factory\RouteCollectionFactory::class,
	\Readigm\Base\Routing\Matcher\RequestMatcher::class => \Readigm\Base\Routing\Factory\RequestMatcherFactory::class,
	\Readigm\Base\Routing\Generator\URIGenerator::class => \Readigm\Base\Routing\Factory\URIGeneratorFactory::class,
	\Readigm\Base\Routing\Redirector\Redirector::class => \Readigm\Base\Routing\Factory\RedirectorFactory::class,
	\Readigm\Base\Routing\Validator\RedirectURIValidator::class => \Readigm\Base\Routing\Factory\RedirectURIValidatorFactory::class,

	\Readigm\Generator\RandomStringGenerator::class => \Readigm\Generator\Factory\RandomStringGeneratorFactory::class,

	\Readigm\Http\Controller\Authentication\LoginController::class => \Readigm\Http\Controller\Factory\LoginControllerFactory::class,
	\Readigm\Http\Controller\Authentication\LogoutController::class => \Readigm\Http\Controller\Factory\LogoutControllerFactory::class,
	\Readigm\Http\Controller\Authentication\RegisterController::class => \Readigm\Http\Controller\Factory\RegisterControllerFactory::class,
	\Readigm\Http\Controller\Authentication\EmailActivationController::class => \Readigm\Http\Controller\Factory\EmailActivationControllerFactory::class,
	\Readigm\Http\Controller\Authentication\RegistrationFormValidationController::class => \Readigm\Http\Controller\Factory\RegistrationFormValidationControllerFactory::class,
	\Readigm\Http\Controller\Authentication\LoginFormValidationController::class => \Readigm\Http\Controller\Factory\LoginFormValidationControllerFactory::class,
	\Readigm\Http\Controller\Setting\EmailAddController::class => \Readigm\Http\Controller\Factory\EmailAddControllerFactory::class,
	\Readigm\Http\Controller\User\ProfileViewController::class => \Readigm\Http\Controller\Factory\ProfileViewControllerFactory::class,
	\Readigm\Http\Controller\Home\HomeViewController::class => \Readigm\Http\Controller\Factory\HomeViewControllerFactory::class,
	\Readigm\Http\Controller\Authentication\LoginViewController::class => \Readigm\Http\Controller\Factory\LoginViewControllerFactory::class,
	\Readigm\Http\Controller\Authentication\RegisterViewController::class => \Readigm\Http\Controller\Factory\RegisterViewControllerFactory::class,
	\Readigm\Http\Controller\Error\HttpErrorViewController::class => \Readigm\Http\Controller\Factory\HttpErrorViewControllerFactory::class,

    \Readigm\Http\Middleware\Authentication\LoginMiddleware::class => \Readigm\Http\Middleware\Factory\LoginMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\RegisterMiddleware::class => \Readigm\Http\Middleware\Factory\RegisterMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\RegistrationFeedbackMiddleware::class => \Readigm\Http\Middleware\Factory\RegistrationFeedbackMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\LogoutMiddleware::class => \Readigm\Http\Middleware\Factory\LogoutMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\EmailActivationMiddleware::class => \Readigm\Http\Middleware\Factory\EmailActivationMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\LoginViewMiddleware::class => \Readigm\Http\Middleware\Factory\LoginViewMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\RegisterViewMiddleware::class => \Readigm\Http\Middleware\Factory\RegisterViewMiddlewareFactory::class,
	\Readigm\Http\Middleware\Authentication\LoginFeedbackMiddleware::class => \Readigm\Http\Middleware\Factory\LoginFeedbackMiddlewareFactory::class,
	\Readigm\Http\Middleware\Setting\EmailActivationRequestMiddleware::class => \Readigm\Http\Middleware\Factory\EmailActivationRequestMiddlewareFactory::class,
	\Readigm\Http\Middleware\Home\HomeViewMiddleware::class => \Readigm\Http\Middleware\Factory\HomeViewMiddlewareFactory::class,
	\Readigm\Http\Middleware\User\ProfileViewMiddleware::class => \Readigm\Http\Middleware\Factory\ProfileViewMiddlewareFactory::class,
	\Readigm\Http\Middleware\Error\HttpErrorViewMiddleware::class => \Readigm\Http\Middleware\Factory\HttpErrorViewMiddlewareFactory::class,

	\Readigm\Loader\GlobalModule\GlobalNavigationLoader::class => \Readigm\Loader\Factory\GlobalNavigationLoaderFactory::class,

	\Readigm\MailSender\ActivationMailSender::class => \Readigm\MailSender\Factory\ActivationMailSenderFactory::class,

	\Readigm\Provider\AuthServiceProvider::class => \Readigm\Provider\Factory\AuthServiceProviderFactory::class,
	\Readigm\Provider\DBServiceProvider::class => \Readigm\Provider\Factory\DBServiceProviderFactory::class,
	\Readigm\Provider\RouteServiceProvider::class => \Readigm\Provider\Factory\RouteServiceProviderFactory::class,
	\Readigm\Provider\SessionServiceProvider::class => \Readigm\Provider\Factory\SessionServiceProviderFactory::class,
	\Readigm\Provider\TemplateServiceProvider::class => \Readigm\Provider\Factory\TemplateServiceProviderFactory::class,

	\Readigm\Security\Auth\Authenticator::class => \Readigm\Security\Auth\Factory\AuthenticatorFactory::class,
    \Readigm\Security\Auth\Authorizer::class => \Readigm\Security\Auth\Factory\AuthorizerFactory::class,

	\Readigm\Security\Encoder\PasswordEncoder::class => \Readigm\Security\Encoder\Factory\PasswordEncoderFactory::class,

	\Readigm\Security\User\UserManager::class => \Readigm\Security\User\Factory\UserManagerFactory::class,

	\Readigm\Security\Validator\UserInfo\ReadableIDValidator::class => \Readigm\Security\Validator\Factory\ReadableIDValidatorFactory::class,
	\Readigm\Security\Validator\UserInfo\EmailValidator::class => \Readigm\Security\Validator\Factory\EmailValidatorFactory::class,
	\Readigm\Security\Validator\UserInfo\NameValidator::class => \Readigm\Security\Validator\Factory\NameValidatorFactory::class,
	\Readigm\Security\Validator\UserInfo\PasswordValidator::class => \Readigm\Security\Validator\Factory\PasswordValidatorFactory::class,
];
