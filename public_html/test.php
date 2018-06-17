<?php
$userinfo = json_decode($_POST['userinfo'], true);

$result = [
	"email" => true,
	"username" => true,
	"password" => true
];

// Verify user info
if ($userinfo['name'] == "iron man") {
	$result['username'] = false;
}

echo json_encode($result);
?>
