<?php
/**
 * Abstract form for service provider.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Provider;

use Readigm\Base\Factory\MasterFactory;

abstract class AbstractServiceProvider
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @param MasterFactory $factory
	 */
	public function __construct(MasterFactory $factory)
	{
		$this->factory = $factory;
	}

	/**
	 * Boot services.
	 *
	 * @return mixed	Service
	 */
	abstract public function boot();
}
