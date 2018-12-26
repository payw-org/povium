<?php
/**
 * Loader for data in global navigation.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

namespace Readigm\Loader\GlobalModule;

use Readigm\Loader\LoaderInterface;

class GlobalNavigationLoader implements LoaderInterface
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
