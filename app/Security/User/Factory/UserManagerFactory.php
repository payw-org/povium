<?php
/**
* This factory is responsible for creating "UserManager" instance.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Security\User\Factory;

use Readigm\Base\Database\Factory\AbstractRecordManagerFactory;

class UserManagerFactory extends AbstractRecordManagerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = $this->configLoader->load('user_manager');

		$this->args[] = $config;
	}
}
