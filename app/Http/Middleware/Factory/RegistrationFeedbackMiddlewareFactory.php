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

class RegistrationFeedbackMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     */
    protected function prepareArgs()
    {
        $master_factory = new MasterFactory();

        $registration_form_validation_controller = $master_factory->createInstance(
        	'\Povium\Http\Controller\Authentication\RegistrationFormValidationController'
		);

        $this->args = array(
            $registration_form_validation_controller
        );
    }
}
