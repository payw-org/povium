<?php
/**
 * Controller for loading config of register view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 Povium
 */

namespace Readigm\Http\Controller\Authentication;

use Readigm\Http\Controller\StandardViewController;

class RegisterViewController extends StandardViewController
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
