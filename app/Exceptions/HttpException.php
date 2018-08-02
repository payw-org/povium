<?php
/**
* Http exception
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

namespace Povium\Exceptions;

class HttpException extends \Exception
{
	/**
	 * Http response code in 400 series or 500 series
	 *
	 * @var int
	 */
	private $responseCode;

	/**
	 * @param int  			$response_code
	 * @param string  		$message
	 * @param int 			$code
	 * @param \Throwable 	$previous
	 */
	public function __construct($response_code, $message = "", $code = 0, $previous = null)
 	{
		$this->responseCode = $response_code;

		parent::__construct($message, $code, $previous);
	}

	/**
	 * @return int
	 */
	public function getResponseCode()
	{
		return $this->responseCode;
	}
}
