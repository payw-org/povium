<?php
/**
* Abstract form for factory which is responsible for creating instance
* of given type.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Base\Factory;

abstract class AbstractChildFactory implements FactoryInterface
{
	/**
	* Fully qualified type name
	*
	* @var string
	*/
	protected $type;

	/**
	* Arguments for creating instance
	*
	* @var array
	*/
	protected $args = array();

	/**
	* {@inheritdoc}
	*/
	public function createInstance($type)
	{
		$this->type = $type;
		$materials = array_slice(func_get_args(), 1);
		$this->prepareArgs(...$materials);

		return $this->create();
	}

	/**
	* Prepare arguments.
	*
	* @param	mixed	materials
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
