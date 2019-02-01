<?php
/**
* Controller for logout.
*
* @author 		H.Chihoon
* @copyright 	2019 Payw
*/

namespace Readigm\Http\Controller\Authentication;

use Readigm\Base\Http\Session\SessionManager;
use Readigm\Security\Auth\Authenticator;

class LogoutController
{
	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * @param Authenticator		$authenticator
	 * @param SessionManager	$session_manager
	 */
	public function __construct(
		Authenticator $authenticator,
		SessionManager $session_manager
	) {
		$this->authenticator = $authenticator;
		$this->sessionManager = $session_manager;
	}

	/**
	* Logout the current user.
	* Destroy the current access key.
	* Then, regenerate session id.
	*/
	public function logout()
	{
		$this->authenticator->deleteCurrentAccessKey();
		$this->authenticator->deleteCurrentAccessKeyRecord();

		$this->sessionManager->regenerateSessionID(false, true);
	}
}
