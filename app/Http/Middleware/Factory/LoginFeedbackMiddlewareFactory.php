<?php
/**
 * This factory is responsible for creating "LoginFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Authentication\LoginFormValidationController;

class LoginFeedbackMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$login_form_validation_controller = $factory->createInstance(LoginFormValidationController::class);

		$this->args = array(
			$login_form_validation_controller
		);
	}
}
