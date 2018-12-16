<?php
/**
 * Interface for service provider.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

interface ServiceProviderInterface
{
	/**
	 * Boot services.
	 *
	 * @return mixed	Service
	 */
	public function boot();
}
