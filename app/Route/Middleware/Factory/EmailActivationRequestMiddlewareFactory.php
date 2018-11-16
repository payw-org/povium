<?php
/**
 * This factory is responsible for creating "EmailActivationRequestMiddleware" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Base\Routing\Router;
use Povium\Security\User\User;

class EmailActivationRequestMiddlewareFactory extends AbstractChildFactory
{
    /**
     * {@inheritdoc}
     *
     * @param Router
     * @param User
     */
    protected function prepareArgs()
    {
        $materials = func_get_args();
        $master_factory = new MasterFactory();

        $config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_request_middleware.php');
        $random_string_generator = $master_factory->createInstance('\Povium\Generator\RandomStringGenerator');
        $email_add_controller = $master_factory->createInstance('\Povium\Security\Authentication\Controller\EmailAddController');
        $activation_mail_sender = $master_factory->createInstance('\Povium\MailSender\ActivationMailSender');
        $router = $materials[0];
        $user = $materials[1];

        $this->args = array(
            $config,
            $random_string_generator,
            $email_add_controller,
            $activation_mail_sender,
            $router,
            $user
        );
    }
}
