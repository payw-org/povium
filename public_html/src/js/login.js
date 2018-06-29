// 로그인 받을 때
// array('email' => '', 'password' => '', 'remember' => bool);
// 로그인 리턴할 때
// array('err' => bool, 'msg' => 'err msg for display', 'redirect' => 'redirect url');

var emailInput = new TextInput(document.querySelector('.input-wrapper.email input'));
emailInput.showError("fuck this shit");