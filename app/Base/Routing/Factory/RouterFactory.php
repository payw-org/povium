<?php
/**
* This factory is responsible for creating "Router" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Routing\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Routing\Generator\URIGenerator;
use Readigm\Base\Routing\Matcher\RequestMatcher;
use Readigm\Base\Routing\Redirector\Redirector;

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
