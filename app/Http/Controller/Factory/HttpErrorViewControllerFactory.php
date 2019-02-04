<?php
/**
 * This factory is responsible for creating "HttpErrorViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Controller\Factory;

class HttpErrorViewControllerFactory extends StandardViewControllerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$http_response_config = $this->configLoader->load('http_response');

		$this->args[] = $http_response_config;
	}
}
