<?php
/**
 * Exception thrown when a route does not exist.
 * This exception should trigger an HTTP 404 response.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Exception;

class RouteNotFoundException extends \UnexpectedValueException implements ExceptionInterface
{
}
