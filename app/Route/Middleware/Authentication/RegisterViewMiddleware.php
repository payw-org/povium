<?php
/**
 * Middleware for register view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Authentication;

use Povium\Base\Routing\Router;
use Povium\Route\Middleware\AbstractViewMiddleware;
use Povium\Route\Middleware\RefererCheckerInterface;

class RegisterViewMiddleware extends AbstractViewMiddleware implements RefererCheckerInterface
{
	/**
	 * @var Router
	 */
	protected $router;

	/**
	 * @param Router $router
	 */
	public function __construct(Router $router)
	{
		$this->router = $router;
	}

	/**
	 * {@inheritdoc}
	 */
	public function verifyViewRequest()
	{
		$referer_query = $this->checkReferer();

		if ($referer_query !== false) {
			$this->router->redirect('/register' . '?' . $referer_query);
		}
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
