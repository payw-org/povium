<?php
/**
 * Middleware for register.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware\Authentication;

use Povium\Middleware\AbstractAjaxMiddleware;
use Povium\Security\Authentication\Controller\RegisterController;
use Povium\Security\Authentication\Controller\LoginController;
use Povium\Base\Routing\Validator\RedirectURIValidator;

class RegisterMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var RegisterController
     */
    protected $registerController;

    /**
     * @var LoginController
     */
    protected $loginController;

    /**
     * @var RedirectURIValidator
     */
    protected $redirectURIValidator;

    /**
     * @param RegisterController    $register_controller
     * @param LoginController       $login_controller
     * @param RedirectURIValidator  $redirect_uri_validator
     */
    public function __construct(
        RegisterController $register_controller,
        LoginController $login_controller,
        RedirectURIValidator $redirect_uri_validator
    ) {
        $this->registerController = $register_controller;
        $this->loginController = $login_controller;
        $this->redirectURIValidator = $redirect_uri_validator;
    }

    /**
     * Receive register inputs and process register.
     */
    public function register()
    {
        $return = array(
            'err' => true,
            'msg' => '',
            'redirect' => null
        );

        /* Receive register inputs */

        $register_inputs = $this->receiveAjaxData();
        $readable_id = $register_inputs['readable_id'];
        $name = $register_inputs['name'];
        $password = $register_inputs['password'];

        /* Process register and set redirect uri */

        //	Get querystring of referer
        $querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
        if (isset($querystring)) {
            parse_str($querystring, $query_params);
        }

        $register_return = $this->registerController->register($readable_id, $name, $password);
        $return['err'] = $register_return['err'];
        $return['msg'] = $register_return['msg'];

        if ($return['err']) {	//	Register fail

        } else {			 	//	Register success
            $this->loginController->login($readable_id, $password);

            $return['redirect'] = '/';

            //  If redirect uri in query is valid
            if (
                isset($query_params['redirect']) &&
                $this->redirectURIValidator->validate($query_params['redirect'])
            ) {
                $return['redirect'] = $query_params['redirect'];
            }
        }

        $this->sendAjaxData($return);

        return;
    }
}
