<?php
/**
 * Middleware for http error view.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Error;

use Povium\Base\Http\Exception\HttpException;
use Povium\Http\Middleware\AbstractViewMiddleware;

class HttpErrorViewMiddleware extends AbstractViewMiddleware
{
	/**
	 * @var array
	 */
	protected $httpResponseConfig;

	/**
	 * @param array $http_response_config
	 */
	public function __construct(array $http_response_config)
	{
		$this->httpResponseConfig = $http_response_config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param	HttpException	$http_exception
	 */
	public function requestView()
	{
		$args = func_get_args();
		$http_exception = $args[0];

		$response_code = $http_exception->getResponseCode();
		http_response_code($response_code);

		$title = $this->httpResponseConfig[$response_code]['title'];
		$heading = $this->httpResponseConfig[$response_code]['heading'];
		$details = $http_exception->getMessage();

		$this->viewConfig['title'] = $title;
		$this->viewConfig['heading'] = $heading;
		$this->viewConfig['details'] = $details;
	}
}
