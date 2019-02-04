<?php
/**
* This follows factory method pattern.
* A factory can create object instances for given types.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Povium\Base\Factory;

interface FactoryInterface
{
	/**
	* Returns an instance of given types.
	*
	* @param	string $type	Fully qualified type name
	* @param	mixed			Materials
	*
	* @return object An instance of given type
	*/
	public function createInstance($type);
}
