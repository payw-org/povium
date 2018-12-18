<?php
/**
* This factory is responsible for creating "UserManager" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\User\Factory;

use Povium\Base\Database\Factory\AbstractRecordManagerFactory;

class UserManagerFactory extends AbstractRecordManagerFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		parent::prepareArgs();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/user_manager.php');

		$this->args[] = $config;
	}
}
