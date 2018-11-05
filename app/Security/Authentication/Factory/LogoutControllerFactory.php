<?php
/**
* This factory is responsible for creating "LogoutController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Security\Authentication\Authenticator;

class LogoutControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Authenticator
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$authenticator = $materials[0];

		$this->args = array(
			$authenticator
		);
	}
}
