<?php
/**
 * This factory is responsible for creating "EmailActivationRequestMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Http\Middleware\Factory;

use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Routing\Router;
use Readigm\Generator\RandomStringGenerator;
use Readigm\Http\Controller\Setting\EmailAddController;
use Readigm\MailSender\ActivationMailSender;

class EmailActivationRequestMiddlewareFactory extends AbstractAjaxMiddlewareFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Router
     */
    protected function prepareArgs()
    {
    	parent::prepareArgs();

        $materials = func_get_args();
		$factory = new MasterFactory();

		$router = $materials[0];
		$random_string_generator = $factory->createInstance(RandomStringGenerator::class);
		$activation_mail_sender = $factory->createInstance(ActivationMailSender::class);
		$email_add_controller = $factory->createInstance(EmailAddController::class);
		$config = $this->configLoader->load('email_activation_request_middleware');

		$this->args[] = $router;
		$this->args[] = $random_string_generator;
		$this->args[] = $activation_mail_sender;
		$this->args[] = $email_add_controller;
		$this->args[] = $config;
	}
}
