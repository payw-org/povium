<?php
/**
*
* Interface for factory
* This follows factory method pattern
* A factory can create object instances for given types
*
* @author fairyhooni
* @license MIT
*
*/


namespace povium\factory;


interface FactoryInterface {

	/**
	* Returns an instance of given types.
	*
	* @param  string $type
	* @return object
	*/
	public function createInstance($type);


}



?>
