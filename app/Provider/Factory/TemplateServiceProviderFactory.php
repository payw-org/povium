<?php
/**
 * This factory is responsible for creating "TemplateServiceProvider" instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Factory\MasterFactory;
use Povium\Security\User\User;

class TemplateServiceProviderFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param User|false
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$factory = new MasterFactory();
		$current_user = $materials[0];

		$this->args = array(
			$factory,
			$current_user
		);
	}
}
