<?php
/**
 * This factory is responsible for creating "RegistrationFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Authentication\RegistrationFormValidationController;

class RegistrationFeedbackMiddlewareFactory extends AbstractAjaxMiddlewareFactory
{
    /**
     * {@inheritdoc}
     */
    protected function prepareArgs()
    {
    	parent::prepareArgs();

		$factory = new MasterFactory();

        $registration_form_validation_controller = $factory->createInstance(RegistrationFormValidationController::class);

		$this->args[] = $registration_form_validation_controller;
    }
}
