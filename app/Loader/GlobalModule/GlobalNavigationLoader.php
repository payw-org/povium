<?php
/**
 * Loader for data in global navigation.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

namespace Readigm\Loader\GlobalModule;

class GlobalNavigationLoader
{
	/**
	 * @return array
	 */
	public function loadData()
	{
		$data = array();

		if ($GLOBALS['is_logged_in']) {
			$data['current_user'] = array(
				'name' => $GLOBALS['current_user']->getName()
			);
		}

		return $data;
	}
}
