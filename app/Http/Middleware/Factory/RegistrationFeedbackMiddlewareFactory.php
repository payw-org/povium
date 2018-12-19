<?php
/**
 * This factory is responsible for creating "RegistrationFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\Authentication\RegistrationFormValidationController;

class RegistrationFeedbackMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     */
    protected function prepareArgs()
    {
		$factory = new MasterFactory();

        $registration_form_validation_controller = $factory->createInstance(RegistrationFormValidationController::class);

		$this->args[] = $registration_form_validation_controller;
    }
}
