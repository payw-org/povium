<?php
/**
 * This factory is responsible for creating "HttpErrorViewController" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Loader\GlobalModule\GlobalNavigationLoader;

class HttpErrorViewControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$global_navigation_loader = $factory->createInstance(GlobalNavigationLoader::class);
		$http_response_config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');

		$this->args = array(
			$global_navigation_loader,
			$http_response_config
		);
	}
}
