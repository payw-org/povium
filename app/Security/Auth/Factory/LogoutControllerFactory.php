<?php
/**
* This factory is responsible for creating "LogoutController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Security\Auth\Auth;

class LogoutControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Auth
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$auth = $materials[0];

		$this->args = array(
			$auth
		);
	}
}
