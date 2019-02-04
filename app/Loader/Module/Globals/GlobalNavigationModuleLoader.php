<?php
/**
 * Loader for data in global navigation module.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Povium\Loader\Module\Globals;

use Povium\Loader\Module\ModuleLoaderInterface;

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
