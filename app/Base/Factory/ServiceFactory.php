<?php
/**
* This Factory is responsible for creating instance of type based on service.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Factory;

use Povium\Base\DBConnection;

class ServiceFactory extends AbstractChildFactory
{
	/**
	* Manufacture materials into arguments
	*
	* @param mixed optional
	*
	* @return void
	*/
	protected function prepareArgs()
	{
		$materials = func_get_args();

		//	Prepare arguments for each type
		$args = array();
		switch ($this->type) {
			case '\Povium\Auth':
				$args[] = DBConnection::getInstance()->getConn();

				break;
			case '\Povium\Mailer':

				break;
			case '\Povium\Base\Routing\Router':

				break;
			case '\Povium\Base\Routing\Redirector':
				$args[] = BASE_URI;

				break;
		}

		$this->args = $args;
	}
}
