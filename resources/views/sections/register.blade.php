@extends('layouts.base')

@section('title')
	<title>Povium | 회원가입</title>
@endsection

@section('content')

	<main id="register-main">
		<div class="introduce-header">
			<img class="header-icon" src="/assets/images/writing.svg" alt="">
			<h1>좋은 글, 세상을 바꾸는 힘.</h1>
			<!-- <h1>Where words matter.</h1> -->
			<p>지금 가입하고 한 달 동안<br>무료로 이용해 보세요!</p>
			<!-- <p>Register now and<br>experience a month for free.</p> -->
		</div>
		<div class="provider">
			<div class="input-wrapper readable-id">
				<figure class="icon"></figure>
				<label class="placeholder">아이디</label>
				<input class="id input-basic reg-input" type="text" autocomplete="off" spellcheck="false">
			</div>
			<!-- <ul class="condition">
				<li class="passed">3자 이상 20자 이하</li>
				<li>알파벳 소문자, 숫자, _ 조합</li>
			</ul> -->
			<div class="input-wrapper name">
				<figure class="icon"></figure>
				<label class="placeholder">이름</label>
				<input class="username input-basic reg-input" type="text" autocomplete="off" spellcheck="false">
			</div>
			<div class="input-wrapper password">
				<figure class="icon"></figure>
				<label class="placeholder">암호</label>
				<input class="password input-basic reg-input" type="password" autocomplete="off" spellcheck="false">
				<button class="view"></button>
			</div>
			<div class="strength hidden">
				<div class="bar bar-0"></div>
				<div class="bar bar-1"></div>
				<div class="bar bar-2"></div>
			</div>

			<button class="start btn-violet">시작하기</button>
		</div>
		<span class="already">이미 가입하셨나요? <a href="/login">로그인</a>하세요!</span>
	</main>

@endsection
