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
use Readigm\Http\Middleware\CamelToSnakeConverter;

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
	 * @param CamelToSnakeConverter $camel_to_snake_converter
	 * @param Router 				$router
	 * @param LogoutController 		$logout_controller
	 */
    public function __construct(
    	CamelToSnakeConverter $camel_to_snake_converter,
    	Router $router,
        LogoutController $logout_controller
    ) {
    	parent::__construct($camel_to_snake_converter);
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
