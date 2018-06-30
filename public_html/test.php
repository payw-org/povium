<?php
$userinfo = json_decode($_POST['register_inputs'], true);

$result = [
	"err" => true,
	"email_msg" => "이메일 형식을 확인해주세요.",
	"name_msg" => "이름이 조건에 맞지 않아요.",
	"password_msg" => "패스워드를 다시 입력하세요."
];

if ($userinfo['name'] == 'jhaemin') {
	$result['name_msg'] = "";
}

echo json_encode($result);
?>
