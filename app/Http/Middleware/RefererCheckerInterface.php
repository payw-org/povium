<?php
/**
 * Interface for checking referer.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware;

interface RefererCheckerInterface
{
    /**
     * Check referer for current request.
     */
    public function checkReferer();
}
