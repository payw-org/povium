<?php
/**
 * Exception thrown when a type does not register.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Factory\Exception;

class UnregisteredTypeException extends \InvalidArgumentException implements ExceptionInterface
{
}
