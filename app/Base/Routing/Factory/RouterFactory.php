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
use Povium\Base\Routing\Generator\URIGenerator;
use Povium\Base\Routing\Matcher\RequestMatcher;
use Povium\Base\Routing\Redirector\Redirector;

class RouterFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$matcher = $factory->createInstance(RequestMatcher::class);
		$generator = $factory->createInstance(URIGenerator::class);
		$redirector = $factory->createInstance(Redirector::class);

		$this->args[] = $matcher;
		$this->args[] = $generator;
		$this->args[] = $redirector;
	}
}
