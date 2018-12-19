<?php
/**
 * This factory is responsible for creating "LoginFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Http\Controller\Authentication\LoginFormValidationController;

class LoginFeedbackMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$login_form_validation_controller = $factory->createInstance(LoginFormValidationController::class);

		$this->args[] = $login_form_validation_controller;
	}
}
