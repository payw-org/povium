<?php
/**
* Router exception
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

namespace Povium\Exceptions;

class RouterException extends \Exception
{
	const EXC_NONEXISTENT_ROUTE_NAME = 1;
	const EXC_INVALID_REVERSED_ROUTING = 2;
}
