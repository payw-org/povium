<?php
/**
 * Exception thrown when a type does not exist.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Base\Factory\Exception;

class NonexistentTypeException extends \InvalidArgumentException implements FactoryExceptionInterface
{
}
