<?php
/**
 * Bootstrap template services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Philo\Blade\Blade;

class TemplateServiceProvider extends AbstractServiceProvider
{
	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$blade = $this->factory->createInstance(Blade::class);

		//	Set template shared data
		$shared_data = array(
			'is_logged_in' => $GLOBALS['is_logged_in']
		);
		$blade->view()->share($shared_data);

		return $blade;
	}
}
