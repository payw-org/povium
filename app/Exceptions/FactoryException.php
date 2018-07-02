<?php
/**
*
* Factory exception
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/


namespace Povium\Exceptions;


class FactoryException extends \Exception {
	const EXC_NONEXISTENT_TYPE = 1;
	const EXC_UNREGISTERED_TYPE = 2;
}


?>
