<?php
/**
* This Factory is responsible for creating instance of given type.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Factory;

abstract class AbstractChildFactory implements FactoryInterface
{
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
	* {@inheritdoc}
	*/
	public function createInstance($type)
	{
		$this->type = $type;
		$materials = array_slice(func_get_args(), 1);
		call_user_func_array(array($this, 'prepareArgs'), $materials);

		return $this->create();
	}

	/**
	* Manufacture materials into arguments
	*
	* @param	mixed	materials
	*
	* @return void
	*/
	abstract protected function prepareArgs();

	/**
	* Create instance.
	*
	* @return object
	*/
	protected function create()
	{
		$instance = new $this->type(...$this->args);

		return $instance;
	}
}
