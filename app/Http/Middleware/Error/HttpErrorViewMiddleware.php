<?php
/**
 * Middleware for http error view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Error;

use Povium\Base\Http\Exception\HttpException;
use Povium\Http\Controller\Error\HttpErrorViewController;
use Povium\Http\Middleware\AbstractViewMiddleware;

class HttpErrorViewMiddleware extends AbstractViewMiddleware
{
	/**
	 * @var HttpErrorViewController
	 */
	protected $httpErrorViewController;

	/**
	 * @param HttpErrorViewController $http_error_view_controller
	 */
	public function __construct(HttpErrorViewController $http_error_view_controller)
	{
		$this->httpErrorViewController = $http_error_view_controller;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param	HttpException	$http_exception
	 */
	public function requestViewConfig()
	{
		$args = func_get_args();
		$http_exception = $args[0];

		http_response_code($http_exception->getResponseCode());

		return $this->httpErrorViewController->loadViewConfig($http_exception);
	}
}
