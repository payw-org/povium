<?php
/**
 * Exception thrown when request is expired.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Exception;

class RequestExpiredException extends \UnexpectedValueException implements ExceptionInterface
{
}
