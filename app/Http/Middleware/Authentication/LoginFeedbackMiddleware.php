<?php
/**
 * Middleware for login feedback.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Authentication;

use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Controller\Authentication\LoginFormValidationController;
use Povium\Http\Middleware\Converter\CamelToSnakeConverter;

class LoginFeedbackMiddleware extends AbstractAjaxMiddleware
{
	/**
	 * @var LoginFormValidationController
	 */
	protected $loginFormValidationController;

	/**
	 * @param CamelToSnakeConverter 		$camel_to_snake_converter
	 * @param LoginFormValidationController $login_form_validation_controller
	 */
	public function __construct(
		CamelToSnakeConverter $camel_to_snake_converter,
		LoginFormValidationController $login_form_validation_controller
	) {
		parent::__construct($camel_to_snake_converter);
		$this->loginFormValidationController = $login_form_validation_controller;
	}

	/**
	 * Receive login form and validate it.
	 */
	public function giveFeedback()
	{
		/* Receive fields */

		$login_form = $this->receiveAjaxData();
		$identifier = $login_form['identifier'];
		$password = $login_form['password'];

		/* Validate fields */

		$return = $this->loginFormValidationController->validateAllFields(
			$identifier,
			$password
		);

		$this->sendAjaxData($return);
	}
}
