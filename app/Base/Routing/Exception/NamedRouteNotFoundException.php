<?php
/**
 * Exception thrown when a route name does not exist.
 *
 * @author H.Chihoon
 * @copyright 2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Exception;

class NamedRouteNotFoundException extends \InvalidArgumentException implements RouterExceptionInterface
{
}
