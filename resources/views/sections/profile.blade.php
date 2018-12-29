@extends('layouts.base')

@section('title')
	<title>Povium | {{$profile_info['name']}}</title>
@endsection

@section('content')
	<main id="profile-main">

		<div id="info">
			<div class="profile-image">
				<img src="{{$profile_info['profile_image']}}" alt="" onerror="this.src='/assets/images/profile/user-profile-default.svg'">
			</div>
			<h1 class="name">{{$profile_info['name']}}</h1>
			<p class="manifesto">{{$profile_info['bio']}}</p>
		</div>

		<div id="history">

			<div class="side side-menu">
				<ol class="menu">
					<li class="menu-item mi-post selected" data-mi-name="post">포스트</li>
					<li class="menu-item mi-series" data-mi-name="series">시리즈</li>
					<li class="menu-item mi-like" data-mi-name="like">좋아요</li>
					<li class="menu-item mi-comment" data-mi-name="comment">코멘트</li>
				</ol>
			</div>
			
			<div class="board">
				<div class="board-container board-post selected">
					<h1 class="board-title">포스트</h1>
					<div class="board-item post">
						<h2 class="post-title">장어덮밥을 먹을 수 없게 된다면?</h2>
						<div class="post-image-wrapper">
							<img class="post-image" src="/assets/images/sets/1.jpg" alt="">
						</div>
						<p class="post-content-preview">장어 덮밥을 먹을 수 없다면 불고기덮밥을 먹으면 된다.</p>
					</div>
					<div class="board-item post">
						<h2 class="post-title">'동네다움'을 지킬 수 있는 방법</h2>
						<div class="post-image-wrapper">
							<img class="post-image" src="/assets/images/sets/2.jpg" alt="">
						</div>
						<p class="post-content-preview">우리 동네는 좋다.</p>
					</div>
					<div class="board-item post">
						<h2 class="post-title">장어덮밥을 먹을 수 없게 된다면?</h2>
						<div class="post-image-wrapper">
							<img class="post-image" src="/assets/images/sets/1.jpg" alt="">
						</div>
						<p class="post-content-preview">장어 덮밥을 먹을 수 없다면 불고기덮밥을 먹으면 된다.</p>
					</div>
					<div class="board-item post">
						<h2 class="post-title">장어덮밥을 먹을 수 없게 된다면?</h2>
						<div class="post-image-wrapper">
							<img class="post-image" src="/assets/images/sets/1.jpg" alt="">
						</div>
						<p class="post-content-preview">장어 덮밥을 먹을 수 없다면 불고기덮밥을 먹으면 된다.</p>
					</div>
					<div class="board-item post">
						<h2 class="post-title">장어덮밥을 먹을 수 없게 된다면?</h2>
						<div class="post-image-wrapper">
							<img class="post-image" src="/assets/images/sets/1.jpg" alt="">
						</div>
						<p class="post-content-preview">장어 덮밥을 먹을 수 없다면 불고기덮밥을 먹으면 된다.</p>
					</div>
				</div>
				<div class="board-container board-series">
					<h1 class="board-title">시리즈</h1>
				</div>
				<div class="board-container board-like">
					<h1 class="board-title">좋아요</h1>
				</div>
				<div class="board-container board-comment">
					<h1 class="board-title">코멘트</h1>
				</div>
			</div>
		</div>

	</main>
@endsection
