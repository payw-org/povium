<?php
/**
 * Loader for data in global navigation.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Loader\GlobalModule;

class GlobalNavigationLoader
{
	public function __construct()
	{
	}

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
