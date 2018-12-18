<?php
/**
 * Bootstrap session services.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Provider;

use Povium\Base\Http\Session\SessionManager;

class SessionServiceProvider extends AbstractServiceProvider
{
	/**
	 * {@inheritdoc}
	 */
	public function boot()
	{
		$session_manager = $this->factory->createInstance(SessionManager::class);
		$session_manager->setSessionConfig();
		$session_manager->startSession();

		return $session_manager;
	}
}

