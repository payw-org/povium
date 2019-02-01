<?php
/**
 * Interface for module loader.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Loader\Module;

interface ModuleLoaderInterface
{
	/**
	 * Load data for specific module.
	 *
	 * @param mixed
	 *
	 * @return array
	 */
	public function loadData();
}
