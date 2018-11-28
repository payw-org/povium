<?php
/**
 * Exception thrown when user not found.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Exception;

class UserNotFoundException extends \UnexpectedValueException implements ExceptionInterface
{
}
