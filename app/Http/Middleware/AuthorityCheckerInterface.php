<?php
/**
 * Interface for checking authority.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware;

interface AuthorityCheckerInterface
{
    /**
     * Check if satisfy the required authority level.
     */
    public function checkAuthority();
}
