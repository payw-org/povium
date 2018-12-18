<?php
/**
 * Controller for loading config of register view page.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Authentication;

use Povium\Http\Controller\StandardViewController;

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
