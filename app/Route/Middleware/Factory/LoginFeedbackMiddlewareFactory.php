<?php
/**
 * This factory is responsible for creating "LoginFeedbackMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;

class LoginFeedbackMiddlewareFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$login_form_validation_controller = $master_factory->createInstance(
			'\Povium\Security\Authentication\Controller\LoginFormValidationController'
		);

		$this->args = array(
			$login_form_validation_controller
		);
	}
}
