<?php
/**
 * Exception thrown when a type does not register.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Base\Factory\Exception;

class UnregisteredTypeException extends \InvalidArgumentException implements ExceptionInterface
{
}
