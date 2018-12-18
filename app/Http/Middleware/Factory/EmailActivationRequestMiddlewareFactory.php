<?php
/**
 * This factory is responsible for creating "EmailActivationRequestMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Generator\RandomStringGenerator;
use Povium\Http\Controller\Setting\EmailAddController;
use Povium\MailSender\ActivationMailSender;

class EmailActivationRequestMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Router
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();
		$factory = new MasterFactory();

		$router = $materials[0];
		$random_string_generator = $factory->createInstance(RandomStringGenerator::class);
		$activation_mail_sender = $factory->createInstance(ActivationMailSender::class);
		$email_add_controller = $factory->createInstance(EmailAddController::class);
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_request_middleware.php');

		$this->args[] = $router;
		$this->args[] = $random_string_generator;
		$this->args[] = $activation_mail_sender;
		$this->args[] = $email_add_controller;
		$this->args[] = $config;
	}
}
