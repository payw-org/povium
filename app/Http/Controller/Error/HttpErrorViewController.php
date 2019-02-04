<?php
/**
 * Controller for loading config of http error view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Povium\Http\Controller\Error;

use Povium\Base\Http\Exception\HttpException;
use Povium\Http\Controller\StandardViewController;
use Povium\Loader\Module\Globals\GlobalNavigationModuleLoader;

class HttpErrorViewController extends StandardViewController
{
	/**
	 * @var array
	 */
	protected $httpResponseConfig;

	/**
	 * @param GlobalNavigationModuleLoader 	$global_navigation_module_loader
	 * @param array 						$http_response_config
	 */
	public function __construct(
		GlobalNavigationModuleLoader $global_navigation_module_loader,
		array $http_response_config
	) {
		parent::__construct($global_navigation_module_loader);
		$this->httpResponseConfig = $http_response_config;
	}

	/**
	 * {@inheritdoc}
	 *
	 * @param HttpException	$http_exception
	 */
	public function loadViewConfig()
	{
		parent::loadViewConfig();

		$args = func_get_args();
		$http_exception = $args[0];

		$response_code = $http_exception->getResponseCode();

		$this->viewConfig['error'] = array(
			'title' => $this->httpResponseConfig[$response_code]['title'],
			'heading' => $this->httpResponseConfig[$response_code]['heading'],
			'details' => $http_exception->getMessage()
		);

		return $this->viewConfig;
	}
}
