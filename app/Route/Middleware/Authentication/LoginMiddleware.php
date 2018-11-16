<?php
/**
 * Middleware for login.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Authentication;

use Povium\Route\Middleware\AbstractAjaxMiddleware;
use Povium\Security\Authentication\Controller\LoginController;
use Povium\Base\Routing\Validator\RedirectURIValidator;

class LoginMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var LoginController
     */
    protected $loginController;

    /**
     * @var RedirectURIValidator
     */
    protected $redirectURIValidator;

    /**
     * @param LoginController       $login_controller
     * @param RedirectURIValidator  $redirect_uri_validator
     */
    public function __construct(
        LoginController $login_controller,
        RedirectURIValidator $redirect_uri_validator
    ) {
        $this->loginController = $login_controller;
        $this->redirectURIValidator = $redirect_uri_validator;
    }

    /**
     * Receive login inputs and process login.
     */
    public function login()
    {
        $return = array(
            'err' => true,
            'msg' => '',
            'redirect' => null
        );

        /* Receive login inputs */

        $login_inputs = $this->receiveAjaxData();
        $identifier = $login_inputs['identifier'];
        $password = $login_inputs['password'];

        /* Process login and set redirect uri */

        //	Get query string of referer
        $querystring = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
        if (isset($querystring)) {
            parse_str($querystring, $query_params);
        }

        $login_return = $this->loginController->login($identifier, $password);
        $return['err'] = $login_return['err'];
        $return['msg'] = $login_return['msg'];

        if ($return['err']) {   //  Login fail
            if ($return['msg'] == $this->loginController->getConfig()['msg']['account_inactive']) {
                //	@TODO: Set redirect url to reactivate user account.
            }
        } else {                //  Login success
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
