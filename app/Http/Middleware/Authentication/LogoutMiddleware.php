<?php
/**
 * Middleware for logout.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Base\Routing\Router;
use Readigm\Http\Middleware\AbstractAjaxMiddleware;
use Readigm\Http\Controller\Authentication\LogoutController;

class LogoutMiddleware extends AbstractAjaxMiddleware
{
	/**
	 * @var Router
	 */
	protected $router;

    /**
     * @var LogoutController
     */
    protected $logoutController;

	/**
	 * @param Router 			$router
	 * @param LogoutController 	$logout_controller
	 */
    public function __construct(
    	Router $router,
        LogoutController $logout_controller
    ) {
    	$this->router = $router;
        $this->logoutController = $logout_controller;
    }

    /**
     * Process logout.
     */
    public function logout()
    {
        $this->logoutController->logout();

		$this->router->redirect('/');
    }
}
