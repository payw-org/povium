<?php
/**
 * Abstract form for service provider.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Provider;

use Povium\Base\Factory\MasterFactory;

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
