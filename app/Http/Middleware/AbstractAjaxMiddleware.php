<?php
/**
 * Abstract form for middleware which communicating with ajax.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware;

use Readigm\Http\Middleware\Converter\CamelToSnakeConverter;

abstract class AbstractAjaxMiddleware
{
	/**
	 * @var CamelToSnakeConverter
	 */
	protected $camelToSnakeConverter;

	/**
	 * @param CamelToSnakeConverter $camel_to_snake_converter
	 */
	public function __construct(CamelToSnakeConverter $camel_to_snake_converter)
	{
		$this->camelToSnakeConverter = $camel_to_snake_converter;
	}

	/**
     * Receive and decode ajax data.
	 * Convert case.
	 *
	 * @param bool	$convert_data	Option for converting case of array key
     *
     * @return array    Decoded data
     */
    public function receiveAjaxData($convert_data = true)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if ($convert_data && is_array($data)) {
			$data = $this->convertArrayKeyCaseRecursively(
				$data,
				array($this->camelToSnakeConverter, 'convert')
			);
		}

        return $data;
    }

    /**
     * Convert case.
	 * Encode and send ajax data.
     *
     * @param array	$data
	 * @param bool	$convert_data	Option for converting case of array key
     *
     * @return bool     Success or failure
     */
    public function sendAjaxData($data, $convert_data = true)
    {
    	if ($convert_data && is_array($data)) {
    		$data = $this->convertArrayKeyCaseRecursively(
    			$data,
				array($this->camelToSnakeConverter, 'reverse')
			);
		}

        $json_data = json_encode($data);

        if ($json_data === false) {
            return false;
        }

        echo $json_data;

        return true;
    }

	/**
	 * Convert the case of all keys in an array recursively.
	 *
	 * @param array 	$array
	 * @param callable 	$callback	Conversion method
	 *
	 * @return array
	 */
    private function convertArrayKeyCaseRecursively($array, $callback)
	{
		foreach ($array as $key => $value) {
			if (is_array($value)) {
				$array[$key] = $this->convertArrayKeyCaseRecursively($value, $callback);
			}

			if (is_string($key)) {
				$converted_key = $callback($key);

				if ($key != $converted_key) {
					$array[$converted_key] = $array[$key];
					unset($array[$key]);
				}
			}
		}

		return $array;
	}
}
