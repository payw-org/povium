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
		$factory = new MasterFactory();

		$matcher = $factory->createInstance('\Povium\Base\Routing\Matcher\RequestMatcher');
		$generator = $factory->createInstance('\Povium\Base\Routing\Generator\URIGenerator');
		$redirector = $factory->createInstance('\Povium\Base\Routing\Redirector\Redirector');

		$this->args = array(
			$matcher,
			$generator,
			$redirector
		);
	}
}
