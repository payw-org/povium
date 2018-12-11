<?php
/**
 * Bootstrap template services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Philo\Blade\Blade;
use Povium\Base\Factory\MasterFactory;

class TemplateServiceProvider implements ServiceProviderInterface
{
	/**
	 * @var MasterFactory
	 */
	protected $factory;

	/**
	 * @param MasterFactory $factory
	 */
	public function __construct(
		MasterFactory $factory
	) {
		$this->factory = $factory;
	}

	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$blade = $this->factory->createInstance(Blade::class);

		return $blade;
	}
}
