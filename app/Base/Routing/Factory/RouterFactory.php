<?php
/**
* This factory is responsible for creating "Router" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Routing\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;

class RouterFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$master_factory = new MasterFactory();

		$http_response_config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');
		$matcher = $master_factory->createInstance('\Povium\Base\Routing\Matcher\RequestMatcher');
		$generator = $master_factory->createInstance('\Povium\Base\Routing\Generator\URIGenerator');
		$redirector = $master_factory->createInstance('\Povium\Base\Routing\Redirector\Redirector');

		$this->args = array(
			$http_response_config,
			$matcher,
			$generator,
			$redirector
		);
	}
}
