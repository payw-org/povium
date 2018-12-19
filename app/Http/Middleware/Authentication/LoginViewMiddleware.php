<?php
/**
 * Middleware for login view.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Base\Routing\Router;
use Readigm\Http\Controller\Authentication\LoginViewController;
use Readigm\Http\Middleware\AbstractViewMiddleware;
use Readigm\Http\Middleware\RefererCheckerInterface;

class LoginViewMiddleware extends AbstractViewMiddleware implements RefererCheckerInterface
{
	/**
	 * @var Router
	 */
	protected $router;

	/**
	 * @var LoginViewController
	 */
	protected $loginViewController;

	/**
	 * @param Router 				$router
	 * @param LoginViewController 	$login_view_controller
	 */
	public function __construct(
		Router $router,
		LoginViewController $login_view_controller
	) {
		$this->router = $router;
		$this->loginViewController = $login_view_controller;
	}

	/**
	 * {@inheritdoc}
	 */
	public function requestViewConfig()
	{
		$referer_query = $this->checkReferer();

		if ($referer_query !== false) {
			$this->router->redirect('/login' . '?' . $referer_query);
		}

		return $this->loginViewController->loadViewConfig();
	}

	/**
	 * {@inheritdoc}
	 *
	 * @return string|false		If referer is register uri, return its query.
	 */
	public function checkReferer()
	{
		if (
			!isset($_SERVER['HTTP_REFERER']) ||
			'/register' !== parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH)
		) {
			return false;
		}

		$referer_query = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
		$current_query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);

		if (!isset($referer_query) || isset($current_query)) {
			return false;
		}

		return $referer_query;
	}
}
