<?php
/**
* This factory is responsible for creating "URIGenerator" instance.
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Routing\Factory;

use Readigm\Base\Factory\AbstractChildFactory;

class URIGeneratorFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/uri_generator.php');

		$this->args[] = $config;
	}
}
