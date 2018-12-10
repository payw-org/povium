@extends('layouts.base')

@section('title')
	<title>Povium | 로그인</title>
@endsection

@section('content')
	<main id="login-main">
		<div class="header">
			<img src="/assets/images/key.svg">
			<h1>로그인</h1>
		</div>
		<div class="auth-form">
			<div class="input-wrapper identifier">
				<figure class="icon"></figure>
				<input class="input-basic" type="text" autocomplete="off" spellcheck="false">
				<span class="placeholder">아이디 또는 이메일</span>
			</div>
			<div class="input-wrapper password">
				<figure class="icon"></figure>
				<input class="input-basic" type="password" autocomplete="off" spellcheck="false">
				<span class="placeholder">암호</span>
			</div>

			<div class="error-message hidden"></div>

			<button class="confirm btn-aqua">로그인</button>
			<!-- <div class="auto-login">
				<input id="auto-chk" type="checkbox" class="checkbox-violet">
				<label for="auto-chk">날 기억해줘!</label>
				<label for="auto-chk">Preserve login</label>
			</div> -->
		</div>
		<span class="pro">지금 <a href="/register">회원가입</a>하고 한 달 동안 무료로 이용해보세요!</span>
	</main>
@endsection
