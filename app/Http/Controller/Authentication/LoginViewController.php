<?php
/**
 * Controller for loading config of login view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Authentication;

use Povium\Http\Controller\StandardViewController;

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
