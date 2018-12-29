<?php
/**
 * Exception thrown when a route name does not exist.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Base\Routing\Exception;

class NamedRouteNotFoundException extends \InvalidArgumentException implements ExceptionInterface
{
}
