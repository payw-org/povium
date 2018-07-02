<?php
/**
*
* This Factory is responsible for creating instance of given type.
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*
*/


namespace Povium\Lib;


abstract class AbstractChildFactory implements FactoryInterface {

	/**
	* Given type of instance
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
	* Returns an instance of given type.
	*
	* @param  mixed type and some materials
	* @return object An instance of given type
	*/
	public function createInstance ($type) {
		$this->type = $type;
		$materials = array_slice(func_get_args(), 1);
		call_user_func_array(array($this, 'prepareArgs'), $materials);

		return $this->create();
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
	protected function create () {
		//	if '...' operator (require upper version of PHP 5.6.0)
		//	is not working, use below code.
		#	$reflect  = new ReflectionClass($this->type);
		#	$instance = $reflect->newInstanceArgs($this->args);
		$instance = new $this->type (...$this->args);

		return $instance;
	}


}




?>
