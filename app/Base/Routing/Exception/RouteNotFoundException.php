<?php
/**
 * Exception thrown when a route does not exist.
 * This exception should trigger an HTTP 404 response.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Base\Routing\Exception;

class RouteNotFoundException extends \RuntimeException implements ExceptionInterface
{
}
