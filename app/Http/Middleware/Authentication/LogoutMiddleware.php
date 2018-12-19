<?php
/**
 * Middleware for logout.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Authentication;

use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Controller\Authentication\LogoutController;

class LogoutMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var LogoutController
     */
    protected $logoutController;

    /**
     * @param LogoutController $logout_controller
     */
    public function __construct(
        LogoutController $logout_controller
    ) {
        $this->logoutController = $logout_controller;
    }

    /**
     * Process logout.
     */
    public function logout()
    {
        $return = array(
            'err' => true,
            'redirect' => null
        );

        /* Process logout and set redirect uri */

        $this->logoutController->logout();

        $return['err'] = false;
        $return['redirect'] = '/';

        $this->sendAjaxData($return);
    }
}