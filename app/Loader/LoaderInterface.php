<?php
/**
 * Interface for loader.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Loader;

interface LoaderInterface
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
