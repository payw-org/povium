<?php
/**
*
* Class for abstract factory
* This follows factory method pattern
* A factory can create object instances for given types
*
* @author fairyhooni
* @license MIT
*
*/


namespace povium\factory;


abstract class AbstractFactory implements FactoryInterface {

	/**
	* Type of instance
	*
	* @var string
	*/
	protected $type;


	/**
	* Arguments for creating instance
	*
	* @var array
	*/
	protected $args;


	/**
	* Returns instance of given type.
	*
	* @param  mixed type and materials
	* @return object An instance of given type
	*/
	public function createInstance ($type) {
		if(!class_exists($type)) {
			throw new exceptions\FactoryException('Nonexistent type: "' . $type . '"',
			exceptions\FactoryException::EXC_NONEXISTENT_TYPE);
		}

		$this->type = $type;
		$materials = array_slice(func_get_args(), 1);
		call_user_func_array(array($this, 'prepareArgs'), $materials);

		$instance = $this->create();

		return $instance;
	}


	/**
	* Manufacture materials into arguments
	*
	* @param mixed materials
	* @return void
	*/
	abstract protected function prepareArgs ();


	/**
	* Create instance.
	*
	* @return object
	*/
	protected function create() {
		//	if '...' operator (require upper version of PHP 5.6.0)
		//	is not working, use below code.
		#	$reflect  = new ReflectionClass($this->type);
		#	$instance = $reflect->newInstanceArgs($this->args);
		$instance = new $this->type (...$this->args);

		return $instance;
	}


}




?>
