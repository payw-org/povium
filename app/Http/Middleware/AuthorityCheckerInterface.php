<?php
/**
 * Interface for checking authority.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Http\Middleware;

interface AuthorityCheckerInterface
{
    /**
     * Check if satisfy the required authority level.
     */
    public function checkAuthority();
}
