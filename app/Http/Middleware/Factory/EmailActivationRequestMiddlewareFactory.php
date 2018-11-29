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

        $config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_request_middleware.php');
        $random_string_generator = $factory->createInstance(RandomStringGenerator::class);
        $email_add_controller = $factory->createInstance(EmailAddController::class);
        $activation_mail_sender = $factory->createInstance(ActivationMailSender::class);
        $router = $materials[0];

        $this->args = array(
            $config,
            $random_string_generator,
            $email_add_controller,
            $activation_mail_sender,
            $router
        );
    }
}
