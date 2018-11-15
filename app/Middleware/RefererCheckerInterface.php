<?php
/**
 * Interface for referer checker.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware;

interface RefererCheckerInterface
{
    /**
     * Check referer for current middleware.
     */
    public function checkReferer();
}
