<?php
/**
 * Loader for config file.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

namespace Readigm\Loader;

class ConfigLoader
{
	/**
	 * Load config.
	 *
	 * @param	string	Config file names
	 *
	 * @return array
	 */
	public function load()
	{
		$args = func_get_args();

		$all_config = array();

		foreach ($args as $filename) {
			$all_config += require($_SERVER['DOCUMENT_ROOT'] . '/../config/' . $filename . '.php');
		}

		return $all_config;
	}
}
