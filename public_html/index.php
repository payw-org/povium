<?php


$requestURI = explode('/', $_SERVER['REQUEST_URI']);
var_dump($requestURI);
echo "<br>";

echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "<br>";
// echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "<br>";
echo "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "<br>";

var_dump($_REQUEST);


?>
