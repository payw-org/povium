<?php
/**
* Control logout.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Base\Http\Session\SessionManager;
use Povium\Security\Authentication\Authenticator;

class LogoutController
{
	/**
	 * @var SessionManager
	 */
	protected $sessionManager;

	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @param SessionManager	$session_manager
	 * @param Authenticator		$authenticator
	 */
	public function __construct(
		SessionManager $session_manager,
 		Authenticator $authenticator
	) {
		$this->sessionManager = $session_manager;
		$this->authenticator = $authenticator;
	}

	/**
	* Logout the current user.
	* Destroy the current access key.
	* Then, regenerate session id.
	*
	* @return null
	*/
	public function logout()
	{
		$this->authenticator->deleteCurrentAccessKey();
		$this->authenticator->deleteCurrentAccessKeyRecord();

		$this->sessionManager->regenerateSessionID(false, true);
	}
}
