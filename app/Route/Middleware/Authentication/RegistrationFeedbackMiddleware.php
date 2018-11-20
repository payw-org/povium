<?php
/**
 * Middleware for registration feedback.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Authentication;

use Povium\Route\Middleware\AbstractAjaxMiddleware;
use Povium\Security\Authentication\Controller\RegistrationFormValidationController;

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
        /* Receive inputs of registration form */

        $registration_form = $this->receiveAjaxData();
        $readable_id = $registration_form['readable_id'];
        $name = $registration_form['name'];
        $password = $registration_form['password'];

        /* Validate inputs of registration form */

        $return = $this->registrationFormValidationController->validateRegistrationForm(
        	$readable_id,
			$name,
			$password
		);

        $this->sendAjaxData($return);

        return;
    }
}
