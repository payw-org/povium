<?php
/**
*
* Factory exception
*
* @author fairyhooni
* @license MIT
*
*/


namespace povium\factory\exceptions;


class FactoryException extends \Exception {
	const EXC_NONEXISTENT_TYPE = 1;
	const EXC_UNREGISTERED_TYPE = 2;
}


?>
