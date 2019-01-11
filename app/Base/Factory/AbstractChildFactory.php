<?php
/**
* Abstract form for factory which is responsible for creating instance
* of given type.
*
* @author		H.Chihoon
* @copyright	2019 Povium
*/

namespace Readigm\Base\Factory;

use Readigm\Loader\ConfigLoader;

abstract class AbstractChildFactory implements FactoryInterface
{
	/**
	 * @var ConfigLoader
	 */
	protected $configLoader;

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
	 * Create loader for config file.
	 */
	public function __construct()
	{
		$this->configLoader = new ConfigLoader();
	}

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
