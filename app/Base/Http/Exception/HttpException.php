<?php
/**
* Http exception
*
* @author H.Chihoon
* @copyright 2018 DesignAndDevelop
*/

namespace Povium\Base\Http\Exception;

class HttpException extends \RuntimeException implements HttpExceptionInterface
{
	/**
	 * @var array
	 */
	private $config;

	/**
	 * Http response code in 400 series or 500 series
	 *
	 * @var int
	 */
	private $responseCode;

	/**
	 * @param int  			$response_code	Http response code
	 * @param string  		$details		Http response details
	 * @param int 			$code			Error code
	 * @param \Throwable 	$previous		Previous exception
	 */
	public function __construct($response_code, $details = "", $code = 0, $previous = null)
 	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');
		$this->responseCode = $response_code;

		parent::__construct($details, $code, $previous);
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

	/**
	 * Gets the http response title
	 *
	 * @return string
	 */
	public function getTitle()
	{
		return $this->config["$this->responseCode"]['title'];
	}

	/**
	 * Gets the http response message
	 *
	 * @return string
	 */
	public function getMsg()
	{
		return $this->config["$this->responseCode"]['msg'];
	}

	/**
	 * Gets the http response details
	 *
	 * @return string
	 */
	public function getDetails()
	{
		return $this->getMessage();
	}
}
