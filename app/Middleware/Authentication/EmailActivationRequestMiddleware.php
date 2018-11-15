<?php
/**
 * Middleware for requesting email activation.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware\Authentication;

use Povium\Middleware\AbstractAjaxMiddleware;
use Povium\Generator\RandomStringGenerator;
use Povium\Security\Authentication\Controller\EmailAddController;
use Povium\MailSender\ActivationMailSender;
use Povium\Base\Routing\Router;
use Povium\Security\User\User;

class EmailActivationRequestMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var array
     */
    protected $config;

    /**
     * @var RandomStringGenerator
     */
    protected $randomStringGenerator;

    /**
     * @var EmailAddController
     */
    protected $emailAddController;

    /**
     * @var ActivationMailSender
     */
    protected $activationMailSender;

    /**
     * @var Router
     */
    protected $router;

    /**
     * User who requested activation
     *
     * @var User
     */
    protected $user;

    /**
     * @param array                 $config
     * @param RandomStringGenerator $random_string_generator
     * @param EmailAddController    $email_add_controller
     * @param ActivationMailSender  $activation_mail_sender
     * @param Router                $router
     * @param User                  $user
     */
    public function __construct(
        array $config,
        RandomStringGenerator $random_string_generator,
        EmailAddController $email_add_controller,
        ActivationMailSender $activation_mail_sender,
        Router $router,
        User $user
    ) {
        $this->config = $config;
        $this->randomStringGenerator = $random_string_generator;
        $this->emailAddController = $email_add_controller;
        $this->activationMailSender = $activation_mail_sender;
        $this->router = $router;
        $this->user = $user;
    }

    /**
     * Receive email address and request activation.
     */
    public function requestEmailActivation()
    {
        $return = array(
            'err' => true,
            'msg' => ''
        );

        /* Receive email address */

        # $email_inputs = $this->receiveAjaxData();
        # $email = $email_inputs['email'];
        $email = '1000jaman@naver.com';     //  For test

        /* Request email activation */

        $token = $this->randomStringGenerator->generateUUIDV4();

        $email_add_return = $this->emailAddController->addEmail($email, $this->user, $token);
        $return['err'] = $email_add_return['err'];
        $return['msg'] = $email_add_return['msg'];

        if ($return['err']) {	//	Failed to add new email address

        } else {				//	Successfully added new email address
            $activation_link =
                $this->router->generate('email_activation', array(), Router::URL) .
                '?' . http_build_query(array('token' => $token));

            //	Failed to send activation email
            if (!$this->activationMailSender->sendEmail($email, $activation_link)) {
                $return['err'] = true;
                $return['msg'] = $this->config['msg']['activation_email_err'];
            }
        }

        $this->sendAjaxData($return);

        return;
    }
}
