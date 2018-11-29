<?php
/**
 * This factory is responsible for creating "RegistrationFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Authentication\RegistrationFormValidationController;

class RegistrationFeedbackMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     */
    protected function prepareArgs()
    {
		$factory = new MasterFactory();

        $registration_form_validation_controller = $factory->createInstance(RegistrationFormValidationController::class);

        $this->args = array(
            $registration_form_validation_controller
        );
    }
}
