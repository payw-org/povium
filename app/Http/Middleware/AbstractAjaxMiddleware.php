<?php
/**
 * Abstract form for middleware which communicating with ajax.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware;

abstract class AbstractAjaxMiddleware
{
    /**
     * Receive and decode ajax data.
     *
     * @return array    Decoded data
     */
    public function receiveAjaxData()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        return $data;
    }

    /**
     * Encode and send ajax data.
     *
     * @param array     $data
     *
     * @return bool     Success or failure
     */
    public function sendAjaxData($data)
    {
        $json_data = json_encode($data);

        if ($json_data === false) {
            return false;
        }

        echo $json_data;

        return true;
    }
}
