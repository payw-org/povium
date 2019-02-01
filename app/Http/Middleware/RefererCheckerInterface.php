<?php
/**
 * Interface for checking referer.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware;

interface RefererCheckerInterface
{
    /**
     * Check referer for current request.
     */
    public function checkReferer();
}
