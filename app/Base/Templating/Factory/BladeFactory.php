<?php
/**
 * This factory is responsible for creating "Blade" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
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
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/blade.php');

		$this->args[] = $config['views'];
		$this->args[] = $config['cache'];
	}
}
