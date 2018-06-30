<?php
/**
*
* This follows factory method pattern.
* A factory can create object instances for given types
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
* @license MIT
*
*/


namespace povium\factory;


interface FactoryInterface {

	/**
	* Returns an instance of given types.
	*
	* @param  mixed type and some materials
	* @return object An instance of given type
	*/
	public function createInstance ($type);


}



?>
