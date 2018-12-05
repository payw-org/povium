<?php
/**
 * Middleware for requesting email activation.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Setting;

use Povium\Generator\RandomStringGenerator;
use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Controller\Setting\EmailAddController;
use Povium\MailSender\ActivationMailSender;
use Povium\Base\Routing\Router;
use Povium\Security\User\User;

class EmailActivationRequestMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var array
     */
    private $config;

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
     * @param array                 $config
     * @param RandomStringGenerator $random_string_generator
     * @param EmailAddController    $email_add_controller
     * @param ActivationMailSender  $activation_mail_sender
     * @param Router                $router
     */
    public function __construct(
        array $config,
        RandomStringGenerator $random_string_generator,
        EmailAddController $email_add_controller,
        ActivationMailSender $activation_mail_sender,
        Router $router
    ) {
        $this->config = $config;
        $this->randomStringGenerator = $random_string_generator;
        $this->emailAddController = $email_add_controller;
        $this->activationMailSender = $activation_mail_sender;
        $this->router = $router;
    }

    /**
     * Receive email address and request activation.
	 *
	 * @param User	$user	User who requested activation
     */
    public function requestEmailActivation($user)
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

        $email_add_return = $this->emailAddController->addEmail($email, $user, $token);
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
    }
}
