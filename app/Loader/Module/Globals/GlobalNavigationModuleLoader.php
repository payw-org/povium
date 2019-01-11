<?php
/**
 * Loader for data in global navigation module.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Povium
 */

namespace Readigm\Loader\Module\Globals;

use Readigm\Loader\Module\ModuleLoaderInterface;

class GlobalNavigationModuleLoader implements ModuleLoaderInterface
{
	/**
	 * {@inheritdoc}
	 */
	public function loadData()
	{
		$data = array();

		if ($GLOBALS['is_logged_in']) {
			$data['user_name'] = $GLOBALS['current_user']->getName();
		}

		return $data;
	}
}
