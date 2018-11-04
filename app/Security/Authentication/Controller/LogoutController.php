<?php
/**
* Control logout.
*
* @author 		H.Chihoon
* @copyright 	2018 DesignAndDevelop
*/

namespace Povium\Security\Auth\Controller;

use Povium\Security\Auth\Auth;

class LogoutController
{
	/**
	 * @var Auth
	 */
	protected $auth;

	/**
	 * @param Auth $auth
	 */
	public function __construct(Auth $auth)
	{
		$this->auth = $auth;
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
		$this->auth->initializeAuthStatus();
		$this->auth->deleteCurrentAccessKey();
		$this->auth->deleteCurrentAccessKeyRecord();

		$session_manager = $this->auth->getSessionManager();
		$session_manager->regenerateSessionID(false, true);
	}
}
