<?php
/**
 * Exception thrown when token not matched.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Controller\Exception;

class TokenNotMatchedException extends \UnexpectedValueException implements ExceptionInterface
{
}
