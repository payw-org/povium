<?php
/**
 * Middleware for logout.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware\Authentication;

use Povium\Base\Routing\Router;
use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Controller\Authentication\LogoutController;
use Povium\Http\Middleware\Converter\CamelToSnakeConverter;

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
