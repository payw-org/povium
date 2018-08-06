<?php
/**
 * Exception thrown when a parameter is not valid.
 *
 * @author H.Chihoon
 * @copyright 2018 DesignAndDevelop
 */

namespace Povium\Base\Routing\Exception;

class InvalidParameterException extends \InvalidArgumentException implements RouterExceptionInterface
{
}
