<?php

$url = "http://povium.local/test";
$ch = curl_init();

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "postvar1=value1&postvar2=value2&postvar3=value3");

// in real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS,
//          http_build_query(array('postvar1' => 'value1')));

// receive server response ...

$server_output = curl_exec ($ch);

curl_close ($ch);

var_dump($server_output);

// callRestAPI("http://povium.local/test");
//
// function callRestAPI($uri) {
//      $channel = curl_init($uri);
//      curl_setopt($channel, CURLOPT_RETURNTRANSFER, true);
//      curl_setopt($channel, CURLOPT_CUSTOMREQUEST, "PUT");
//      curl_setopt($channel, CURLOPT_POSTFIELDS, array('hi' => 1, 'world' => 2));
//      curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, false);
//      curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 10);
//
//      echo curl_exec($channel);
//      $statusCode = curl_getInfo($channel, CURLINFO_HTTP_CODE);
//      curl_close($channel);
//      return $statusCode;
// }
