<?php
/**
* Control logout.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Authentication\Controller;

use Povium\Security\Authentication\Authenticator;

class LogoutController
{
	/**
	 * @var Authenticator
	 */
	protected $authenticator;

	/**
	 * @param Authenticator $authenticator
	 */
	public function __construct(Authenticator $authenticator)
	{
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
		$this->authenticator->initializeAuthenticationStatus();
		$this->authenticator->deleteCurrentAccessKey();
		$this->authenticator->deleteCurrentAccessKeyRecord();

		//	TODO : VISITOR로 권한 재부여

		$session_manager = $this->authenticator->getSessionManager();
		$session_manager->regenerateSessionID(false, true);
	}
}
