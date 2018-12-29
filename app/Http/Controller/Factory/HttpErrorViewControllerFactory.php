<?php
/**
 * This factory is responsible for creating "HttpErrorViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Controller\Factory;

class HttpErrorViewControllerFactory extends StandardViewControllerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$http_response_config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');

		$this->args[] = $http_response_config;
	}
}
