<?php
/**
 * This factory is responsible for creating "Blade" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Templating\Factory;

use Povium\Base\Factory\AbstractChildFactory;

class BladeFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/blade.php');

		$this->args = array(
			$config['views'],
			$config['cache']
		);
	}
}
