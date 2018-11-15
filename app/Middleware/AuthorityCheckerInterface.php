<?php
/**
 * Interface for authority checker.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware;

interface AuthorityCheckerInterface
{
    /**
     * Check if satisfy the required authority level.
     */
    public function checkAuthority();
}
