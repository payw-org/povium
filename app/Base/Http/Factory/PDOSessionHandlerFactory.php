<?php
/**
* This factory is responsible for creating "PDOSessionHandler" instance.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Http\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\Database\DBConnection;

class PDOSessionHandlerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/session.php');
		$conn = DBConnection::getInstance()->getConn();

		$this->args[] = $config;
		$this->args[] = $conn;
	}
}
