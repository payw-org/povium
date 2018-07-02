<?php
/**
*
* The application factory is a facade to all factories.
* It cannot create any instances itself, but knows which factory is
* responsible for creating which instance and delegates instantiation.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/


namespace Povium\Lib;

use Povium\Exceptions\FactoryException;

class MasterFactory implements FactoryInterface {
	/**
	* Associative array tracking which factory is responsible for a type.
	* Array keys are type names, array values are factory names.
	*
	* @var array
	*/
	protected $typeMap;


	/**
	* Initialize type map
	*/
	public function __construct () {
		$this->typeMap = require($_SERVER['DOCUMENT_ROOT'] . '/../config/factory.php');
	}


	/**
	* Returns an instance of the requested type by delegating call to
	* responsible child factory instance.
	*
	* @param  mixed type and some materials
	* @return object An instance of given type
	*/
	public function createInstance ($type) {
		if (!class_exists($type)) {
			throw new FactoryException('Nonexistent type: "' . $type . '"',
			FactoryException::EXC_NONEXISTENT_TYPE);
		}

		if (!$this->hasFactoryFor($type)) {
			throw new FactoryException('Unregistered type: "' . $type . '"',
			FactoryException::EXC_UNREGISTERED_TYPE);
		}

		$factory = $this->getFactoryFor($type);

		return call_user_func_array(array(new $factory (), 'createInstance'), func_get_args());
	}


	/**
	* Check if responsible factory for creating instance is exist
	*
	* @param  string  $type
	* @return boolean
	*/
	protected function hasFactoryFor ($type) {
		return isset($this->typeMap[$type]);
	}


	/**
	* Get responsible factory name for creating instance of given type
	*
	* @param  string $type
	* @return string factory name
	*/
	protected function getFactoryFor ($type) {
		return $this->typeMap[$type];
	}


}



?>
