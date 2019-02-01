<?php
/**
 * Middleware for register view.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Base\Routing\Router;
use Readigm\Http\Controller\Authentication\RegisterViewController;
use Readigm\Http\Middleware\AbstractViewMiddleware;
use Readigm\Http\Middleware\RefererCheckerInterface;

class RegisterViewMiddleware extends AbstractViewMiddleware implements RefererCheckerInterface
{
	/**
	 * @var Router
	 */
	protected $router;

	/**
	 * @var RegisterViewController
	 */
	protected $registerViewController;

	/**
	 * @param Router 					$router
	 * @param RegisterViewController 	$register_view_controller
	 */
	public function __construct(
		Router $router,
		RegisterViewController $register_view_controller
	) {
		$this->router = $router;
		$this->registerViewController = $register_view_controller;
	}

	/**
	 * {@inheritdoc}
	 */
	public function requestViewConfig()
	{
		$referer_query = $this->checkReferer();

		if ($referer_query !== false) {
			$this->router->redirect('/register' . '?' . $referer_query);
		}

		return $this->registerViewController->loadViewConfig();
	}

	/**
	 * {@inheritdoc}
	 *
	 * @return string|false		If referer is login uri, return its query.
	 */
	public function checkReferer()
	{
		if (
			!isset($_SERVER['HTTP_REFERER']) ||
			'/login' !== parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH)
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
