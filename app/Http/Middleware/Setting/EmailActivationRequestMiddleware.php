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
     * @var Router
     */
    protected $router;

	/**
	 * @var RandomStringGenerator
	 */
	protected $randomStringGenerator;

	/**
	 * @var ActivationMailSender
	 */
	protected $activationMailSender;

	/**
	 * @var EmailAddController
	 */
	protected $emailAddController;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param Router 				$router
	 * @param RandomStringGenerator $random_string_generator
	 * @param ActivationMailSender 	$activation_mail_sender
	 * @param EmailAddController 	$email_add_controller
	 * @param array 				$config
	 */
    public function __construct(
		Router $router,
		RandomStringGenerator $random_string_generator,
		ActivationMailSender $activation_mail_sender,
		EmailAddController $email_add_controller,
		array $config
    ) {
		$this->router = $router;
		$this->randomStringGenerator = $random_string_generator;
		$this->activationMailSender = $activation_mail_sender;
		$this->emailAddController = $email_add_controller;
		$this->config = $config;
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
