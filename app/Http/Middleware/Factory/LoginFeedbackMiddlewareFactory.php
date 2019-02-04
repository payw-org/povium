<?php
/**
 * This factory is responsible for creating "LoginFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\MasterFactory;
use Povium\Http\Controller\Authentication\LoginFormValidationController;

class LoginFeedbackMiddlewareFactory extends AbstractAjaxMiddlewareFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$factory = new MasterFactory();

		$login_form_validation_controller = $factory->createInstance(LoginFormValidationController::class);

		$this->args[] = $login_form_validation_controller;
	}
}
