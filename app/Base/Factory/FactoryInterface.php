<?php
/**
* This follows factory method pattern.
* A factory can create object instances for given types.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Factory;

interface FactoryInterface
{
	/**
	* Returns an instance of given types.
	*
	* @param	string $type
	* @param	mixed
	*
	* @return object An instance of given type
	*/
	public function createInstance($type);
}
