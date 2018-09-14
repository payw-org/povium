<?php
/**
* Http exception
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
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
	 * @param int 			$code			Exception code
	 * @param \Throwable 	$previous		Previous exception
	 */
	public function __construct($response_code, $details = "", $code = 0, $previous = null)
 	{
		$this->config = require($_SERVER['DOCUMENT_ROOT'] . '/../config/http_response.php');
		$this->responseCode = $response_code;

		parent::__construct($details, $code, $previous);
	}

	/**
	 * {@inheritdoc}
	 */
	public function getResponseCode()
	{
		return $this->responseCode;
	}

	/**
	 * {@inheritdoc}
	 */
	public function getTitle()
	{
		return $this->config[strval($this->responseCode)]['title'];
	}

	/**
	 * {@inheritdoc}
	 */
	public function getMsg()
	{
		return $this->config[strval($this->responseCode)]['msg'];
	}

	/**
	 * {@inheritdoc}
	 */
	public function getDetails()
	{
		return $this->getMessage();
	}
}
