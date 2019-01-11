<?php
/**
 * This factory is responsible for creating "Blade" instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Povium
 */

namespace Readigm\Base\Templating\Factory;

use Readigm\Base\Factory\AbstractChildFactory;

class BladeFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = $this->configLoader->load('blade');

		$this->args[] = $config['views'];
		$this->args[] = $config['cache'];
	}
}
