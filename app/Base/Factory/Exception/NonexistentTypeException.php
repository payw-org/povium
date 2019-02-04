<?php
/**
 * Exception thrown when a type does not exist.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Base\Factory\Exception;

class NonexistentTypeException extends \InvalidArgumentException implements ExceptionInterface
{
}
