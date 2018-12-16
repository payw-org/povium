<?php
/**
 * Controller for loading config of http error view.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Error;

use Povium\Base\Http\Exception\HttpException;
use Povium\Loader\GlobalModule\GlobalNavigationLoader;

class HttpErrorViewController
{
	/**
	 * @var GlobalNavigationLoader
	 */
	protected $globalNavigationLoader;

	/**
	 * @var array
	 */
	protected $httpResponseConfig;

	/**
	 * @param GlobalNavigationLoader 	$global_navigation_loader
	 * @param array 					$http_response_config
	 */
	public function __construct(
		GlobalNavigationLoader $global_navigation_loader,
		array $http_response_config
	) {
		$this->globalNavigationLoader = $global_navigation_loader;
		$this->httpResponseConfig = $http_response_config;
	}

	/**
	 * Load config for http error view.
	 *
	 * @param HttpException	$http_exception
	 *
	 * @return array
	 */
	public function loadViewConfig($http_exception)
	{
		$view_config = array();

		$view_config['global_nav'] = $this->globalNavigationLoader->loadData();

		$response_code = $http_exception->getResponseCode();

		$view_config['error'] = array(
			'title' => $this->httpResponseConfig[$response_code]['title'],
			'heading' => $this->httpResponseConfig[$response_code]['heading'],
			'details' => $http_exception->getMessage()
		);

		return $view_config;
	}
}
