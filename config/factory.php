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
	\Philo\Blade\Blade::class => \Povium\Base\Templating\Factory\BladeFactory::class,

	\Povium\Base\Database\DBBuilder::class => \Povium\Base\Database\Factory\DBBuilderFactory::class,

	\Povium\Base\Http\Client::class => \Povium\Base\Http\Factory\ClientFactory::class,
	\Povium\Base\Http\Session\PDOSessionHandler::class => \Povium\Base\Http\Factory\PDOSessionHandlerFactory::class,
	\Povium\Base\Http\Session\SessionManager::class => \Povium\Base\Http\Factory\SessionManagerFactory::class,

	\Povium\Base\Routing\Router::class => \Povium\Base\Routing\Factory\RouterFactory::class,
	\Povium\Base\Routing\RouteCollection::class => \Povium\Base\Routing\Factory\RouteCollectionFactory::class,
	\Povium\Base\Routing\Matcher\RequestMatcher::class => \Povium\Base\Routing\Factory\RequestMatcherFactory::class,
	\Povium\Base\Routing\Generator\URIGenerator::class => \Povium\Base\Routing\Factory\URIGeneratorFactory::class,
	\Povium\Base\Routing\Redirector\Redirector::class => \Povium\Base\Routing\Factory\RedirectorFactory::class,
	\Povium\Base\Routing\Validator\RedirectURIValidator::class => \Povium\Base\Routing\Factory\RedirectURIValidatorFactory::class,

	\Povium\Generator\RandomStringGenerator::class => \Povium\Generator\Factory\RandomStringGeneratorFactory::class,

	\Povium\Http\Controller\Authentication\LoginController::class => \Povium\Http\Controller\Factory\LoginControllerFactory::class,
	\Povium\Http\Controller\Authentication\LogoutController::class => \Povium\Http\Controller\Factory\LogoutControllerFactory::class,
	\Povium\Http\Controller\Authentication\RegisterController::class => \Povium\Http\Controller\Factory\RegisterControllerFactory::class,
	\Povium\Http\Controller\Authentication\EmailActivationController::class => \Povium\Http\Controller\Factory\EmailActivationControllerFactory::class,
	\Povium\Http\Controller\Authentication\RegistrationFormValidationController::class => \Povium\Http\Controller\Factory\RegistrationFormValidationControllerFactory::class,
	\Povium\Http\Controller\Authentication\LoginFormValidationController::class => \Povium\Http\Controller\Factory\LoginFormValidationControllerFactory::class,
	\Povium\Http\Controller\Setting\EmailAddController::class => \Povium\Http\Controller\Factory\EmailAddControllerFactory::class,
	\Povium\Http\Controller\User\ProfileViewController::class => \Povium\Http\Controller\Factory\ProfileViewControllerFactory::class,
	\Povium\Http\Controller\Home\HomeViewController::class => \Povium\Http\Controller\Factory\HomeViewControllerFactory::class,
	\Povium\Http\Controller\Authentication\LoginViewController::class => \Povium\Http\Controller\Factory\LoginViewControllerFactory::class,
	\Povium\Http\Controller\Authentication\RegisterViewController::class => \Povium\Http\Controller\Factory\RegisterViewControllerFactory::class,
	\Povium\Http\Controller\Error\HttpErrorViewController::class => \Povium\Http\Controller\Factory\HttpErrorViewControllerFactory::class,

    \Povium\Http\Middleware\Authentication\LoginMiddleware::class => \Povium\Http\Middleware\Factory\LoginMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\RegisterMiddleware::class => \Povium\Http\Middleware\Factory\RegisterMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\RegistrationFeedbackMiddleware::class => \Povium\Http\Middleware\Factory\RegistrationFeedbackMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\LogoutMiddleware::class => \Povium\Http\Middleware\Factory\LogoutMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\EmailActivationMiddleware::class => \Povium\Http\Middleware\Factory\EmailActivationMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\LoginViewMiddleware::class => \Povium\Http\Middleware\Factory\LoginViewMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\RegisterViewMiddleware::class => \Povium\Http\Middleware\Factory\RegisterViewMiddlewareFactory::class,
	\Povium\Http\Middleware\Authentication\LoginFeedbackMiddleware::class => \Povium\Http\Middleware\Factory\LoginFeedbackMiddlewareFactory::class,
	\Povium\Http\Middleware\Setting\EmailActivationRequestMiddleware::class => \Povium\Http\Middleware\Factory\EmailActivationRequestMiddlewareFactory::class,
	\Povium\Http\Middleware\Home\HomeViewMiddleware::class => \Povium\Http\Middleware\Factory\HomeViewMiddlewareFactory::class,
	\Povium\Http\Middleware\User\ProfileViewMiddleware::class => \Povium\Http\Middleware\Factory\ProfileViewMiddlewareFactory::class,
	\Povium\Http\Middleware\Error\HttpErrorViewMiddleware::class => \Povium\Http\Middleware\Factory\HttpErrorViewMiddlewareFactory::class,

	\Povium\Loader\GlobalModule\GlobalNavigationLoader::class => \Povium\Loader\Factory\GlobalNavigationLoaderFactory::class,

	\Povium\MailSender\ActivationMailSender::class => \Povium\MailSender\Factory\ActivationMailSenderFactory::class,

	\Povium\Provider\AuthServiceProvider::class => \Povium\Provider\Factory\AuthServiceProviderFactory::class,
	\Povium\Provider\DBServiceProvider::class => \Povium\Provider\Factory\DBServiceProviderFactory::class,
	\Povium\Provider\RouteServiceProvider::class => \Povium\Provider\Factory\RouteServiceProviderFactory::class,
	\Povium\Provider\SessionServiceProvider::class => \Povium\Provider\Factory\SessionServiceProviderFactory::class,
	\Povium\Provider\TemplateServiceProvider::class => \Povium\Provider\Factory\TemplateServiceProviderFactory::class,

	\Povium\Security\Auth\Authenticator::class => \Povium\Security\Auth\Factory\AuthenticatorFactory::class,
    \Povium\Security\Auth\Authorizer::class => \Povium\Security\Auth\Factory\AuthorizerFactory::class,

	\Povium\Security\Encoder\PasswordEncoder::class => \Povium\Security\Encoder\Factory\PasswordEncoderFactory::class,

	\Povium\Security\User\UserManager::class => \Povium\Security\User\Factory\UserManagerFactory::class,

	\Povium\Security\Validator\UserInfo\ReadableIDValidator::class => \Povium\Security\Validator\Factory\ReadableIDValidatorFactory::class,
	\Povium\Security\Validator\UserInfo\EmailValidator::class => \Povium\Security\Validator\Factory\EmailValidatorFactory::class,
	\Povium\Security\Validator\UserInfo\NameValidator::class => \Povium\Security\Validator\Factory\NameValidatorFactory::class,
	\Povium\Security\Validator\UserInfo\PasswordValidator::class => \Povium\Security\Validator\Factory\PasswordValidatorFactory::class,
];
