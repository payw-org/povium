<?php
/**
* Http exception
*
* @author		H.Chihoon
* @copyright	2018 Povium
*/

namespace Readigm\Base\Http\Exception;

abstract class HttpException extends \RuntimeException implements ExceptionInterface
{
	/**
	 * Http response code in 400 series or 500 series
	 *
	 * @var int
	 */
	protected $responseCode;

	/**
	 * @param int     		$response_code 	Http response code
	 * @param string  		$message		Http response details
	 * @param integer 		$code
	 * @param \Throwable  	$previous
	 */
	public function __construct(
		int $response_code,
 		string $message = "",
 		int $code = 0,
		\Throwable $previous = null
	) {
		$this->responseCode = $response_code;

		parent::__construct($message, $code, $previous);
	}

	/**
	 * Gets the http response code
	 *
	 * @return int
	 */
	public function getResponseCode()
	{
		return $this->responseCode;
	}
}
