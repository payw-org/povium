<?php
/**
* This factory is responsible for creating "EmailAddController" instance.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Http\Controller\Factory;

use Readigm\Base\Factory\AbstractChildFactory;
use Readigm\Base\Factory\MasterFactory;
use Readigm\Base\Database\DBConnection;
use Readigm\Security\Validator\UserInfo\EmailValidator;

class EmailAddControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$factory = new MasterFactory();

		$conn = DBConnection::getInstance()->getConn();
		$email_validator = $factory->createInstance(EmailValidator::class);
		$config = $this->configLoader->load('email_add_controller');

		$this->args[] = $conn;
		$this->args[] = $email_validator;
		$this->args[] = $config;
	}
}
