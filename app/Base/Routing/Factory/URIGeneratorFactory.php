<?php
/**
* This factory is responsible for creating "URIGenerator" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Base\Routing\Factory;

use Povium\Base\Factory\AbstractChildFactory;

class URIGeneratorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = $this->configLoader->load('uri_generator');

		$this->args[] = $config;
	}
}
