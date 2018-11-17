<?php
/**
 * Interface for checking referer.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware;

interface RefererCheckerInterface
{
    /**
     * Check referer for current request.
     */
    public function checkReferer();
}
