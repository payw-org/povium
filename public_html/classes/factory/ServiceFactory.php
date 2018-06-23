<?php
/**
*
* Class for service factory
* This follows factory method pattern
* A factory can create object instances for given types
*
* @author fairyhooni
* @license MIT
*
*/


namespace povium\factory;


class ServiceFactory extends AbstractFactory {

	/**
	* Manufacture materials into arguments
	*
	* @param mixed materials
	* @return void
	*/
	protected function prepareArgs () {
		$args = func_get_args();
		$db_conn = \povium\conn\DBConnection::getInstance()->getConn();

		array_unshift($args, $db_conn);

		$this->args = $args;
	}

}



?>
