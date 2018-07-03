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

use Povium\Base\Connection\DBConnection;

class ServiceFactory extends AbstractChildFactory {
	/**
	* Manufacture materials into arguments
	*
	* @param mixed materials
	* @return void
	*/
	protected function prepareArgs () {
		$args = func_get_args();
		$db_conn = DBConnection::getInstance()->getConn();

		array_unshift($args, $db_conn);

		$this->args = $args;
	}

}



?>
