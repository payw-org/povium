<?php
/**
*
* This Factory is responsible for creating instance of type based on service.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/

namespace Povium\Base\Factory;

use Povium\Base\Factory\AbstractChildFactory;
use Povium\Base\DBConnection;

class ServiceFactory extends AbstractChildFactory
{
	/**
	* Manufacture materials into arguments
	*
	* @param boolean $with_db Is generated with DB connection arguments?
	* @param mixed materials optional args
	* @return void
	*/
	protected function prepareArgs()
	{
		$args = func_get_args();
		$with_db = array_shift($args);

		if ($with_db) {
			$conn = DBConnection::getInstance()->getConn();
			array_unshift($args, $conn);
		}

		$this->args = $args;
	}
}
