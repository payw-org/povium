<?php
/**
 * Controller for loading config of login view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2019 Payw
 */

namespace Readigm\Http\Controller\Authentication;

use Readigm\Http\Controller\StandardViewController;

class LoginViewController extends StandardViewController
{
	/**
	 * {@inheritdoc}
	 */
	public function loadViewConfig()
	{
		parent::loadViewConfig();

		return $this->viewConfig;
	}
}
