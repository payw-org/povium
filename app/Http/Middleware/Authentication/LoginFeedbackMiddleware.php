<?php
/**
 * Middleware for login feedback.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Http\Middleware\AbstractAjaxMiddleware;
use Readigm\Http\Controller\Authentication\LoginFormValidationController;

class LoginFeedbackMiddleware extends AbstractAjaxMiddleware
{
	/**
	 * @var LoginFormValidationController
	 */
	protected $loginFormValidationController;

	/**
	 * @param LoginFormValidationController $login_form_validation_controller
	 */
	public function __construct(
		LoginFormValidationController $login_form_validation_controller
	) {
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
