<?php
/**
* This factory is responsible for creating "EmailActivationController" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Database\DBConnection;
use Povium\Security\Auth\Auth;

class EmailActivationControllerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 *
	 * @param Auth
	 */
	protected function prepareArgs()
	{
		$materials = func_get_args();

		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/email_activation_controller.php');
		$conn = DBConnection::getInstance()->getConn();
 		$auth = $materials[0];

		$this->args = array(
			$config,
			$conn,
			$auth
		);
	}
}
