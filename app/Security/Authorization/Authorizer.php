<?php
/**
 * Authorize current client.
 *
 * @author 		H.Chihoon
 * @copyright 	2018 DesignAndDevelop
 */

namespace Povium\Security\Authorization;

use Povium\Security\Authentication\Authenticator;

class Authorizer
{
    /* Authority levels */
    const VISITOR = 1;
    const USER = 2;
    const VERIFIED_USER = 4;
    const MEMBER = 8;
    const PRO_EDITOR = 9;
    const HYPER_EDITOR = 16;

	/**
	 * @var Authenticator
	 */
	protected $authenticator;

    /**
     * @param Authenticator $authenticator
     */
	public function __construct(
	    Authenticator $authenticator
    ) {
        $this->authenticator = $authenticator;
	}

    /**
     * Authorize current client to access.
     *
     * @return null
     */
	public function authorize()
    {
        $GLOBALS['authority'] = $this->measureAuthorityLevel();

        return;
    }

    /**
     * Measure authority level of current client.
     *
     * @return int
     */
	protected function measureAuthorityLevel()
    {
        if (!$this->authenticator->isLoggedIn()) {
            return self::VISITOR;
        }

        $current_user = $this->authenticator->getCurrentUser();

        if (!$current_user->isVerified()) {
            return self::USER;
        }

        return self::VERIFIED_USER;

        //  @TODO: Check if client is MEMBER or PRO_EDITOR or HYPER_EDITOR
        // if (MEMBER) {
        //     $is_member = true;
        // } else {
        // 	$is_member = false;
		// }
        //
        // if (PRO_EDITOR) {
        //     $is_pro_editor = true;
        // } else {
        // 	$is_pro_editor = false;
		// }
        //
        // if (($is_member == false) && ($is_pro_editor == false)) {
        //     return self::VERIFIED_USER;
        // } else if (($is_member == true) && ($is_pro_editor == false)) {
        //     return self::MEMBER;
        // } else if (($is_member == false) && ($is_pro_editor == true)) {
        //     return self::PRO_EDITOR;
        // }
        //
        // return self::HYPER_EDITOR;
    }
}
