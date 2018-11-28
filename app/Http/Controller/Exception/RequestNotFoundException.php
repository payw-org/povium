<?php
/**
 * Exception thrown when request not found.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Exception;

class RequestNotFoundException extends \UnexpectedValueException implements ExceptionInterface
{
}
