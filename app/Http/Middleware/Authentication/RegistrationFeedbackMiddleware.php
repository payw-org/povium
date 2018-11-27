<?php
/**
 * Middleware for registration feedback.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Authentication;

use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Controller\Authentication\RegistrationFormValidationController;

class RegistrationFeedbackMiddleware extends AbstractAjaxMiddleware
{
	/**
	 * @var RegistrationFormValidationController
	 */
	protected $registrationFormValidationController;

	/**
	 * @param RegistrationFormValidationController $registration_form_validation_controller
	 */
    public function __construct(
    	RegistrationFormValidationController $registration_form_validation_controller
	) {
		$this->registrationFormValidationController = $registration_form_validation_controller;
	}

	/**
     * Receive registration form and validate it.
     */
    public function giveFeedback()
    {
        /* Receive fields */

        $registration_form = $this->receiveAjaxData();
        $readable_id = $registration_form['readable_id'];
        $name = $registration_form['name'];
        $password = $registration_form['password'];

        /* Validate fields */

        $return = $this->registrationFormValidationController->validateAllFields(
        	$readable_id,
			$name,
			$password
		);

        $this->sendAjaxData($return);

        return;
    }
}
