@extends('layouts.base')

@section('title')
	<title>Povium | 좋은 글, 세상을 바꾸는 힘</title>
@endsection

@section('content')
	<main id="home-main">

		{{-- <section id="popular" class="post-section">
			<button class="scroll-btn left"></button>
			<button class="scroll-btn right"></button>
			<div class="post-view">
				<div class="guided-view">
					<ul class="post-container" data-post-pos="0">
						@foreach ($posts as $post)
							<li class="post-wrapper">
								<div class="post">
									<a class="post-link" href="/register"></a>
									<div class="thumb">
										<img class="hero" src="/assets/images/sets/{{$post['img']}}.jpg" alt="">
									</div>
									<div class="post-contents">
										<h1>{{$post['title']}}</h1>
										<span class="writer-name">- {{$post['editor']}} -</span>
									</div>
								</div>
							</li>
						@endforeach
					</ul>
				</div>
			</div>

		</section> --}}

		<section id="popular">
			<button class="scroll-btn left"></button>
			<button class="scroll-btn right"></button>
			<div class="post-container">
				@foreach ($posts as $post)
				<div class="scroll-item">
					<div class="post">
						<div class="thumb">
							<img src="/assets/images/sets/{{$post['img']}}.jpg" alt="">
						</div>
					</div>
				</div>
				@endforeach
			</div>
		</section>

		<div class="subjects-bar-wrapper">
			<ul class="subjects-bar">
				<li class="subject">테크</li>
				<li class="subject">문화</li>
				<li class="subject">정치</li>
				<li class="subject">디자인</li>
				<li class="subject">소설</li>
				<li class="subject">건강</li>
				<li class="subject">시</li>
				<li class="subject more">더보기</li>
			</ul>
		</div>

		<section id="subject-container">
			<div class="subject">
				<div class="subject-title-wrapper">
					<span class="icon"></span>
					<h1 class="subject-title">테크</h1>
					<button class="more">더보기 ></button>
				</div>
				<div class="subject-posts">
					<div class="featured">
						<a href="" class="absolute-link"></a>
						<img class="thumb" src="/assets/images/post-test-img-5.jpg">
						<div class="preview">
							<div class="header">
								<span class="icon"></span>
								<h2 class="text">추천 포스트</h2>
							</div>
							<div class="editor">
								<span class="name">스왈로부스키</span>
							</div>
							<div class="contents">
								<h2 class="title">Ut mollis</h2>
								<p class="body">Vivamus eu sodales leo, id cursus nulla. Quisque vel tempor nibh. Cras dapibus, sapien at suscipit feugiat, leo ipsum pretium lacus, id maximus magna dui a tellus. Suspendisse neque nisl, eleifend et nunc in, blandit tincidunt nisi. Aliquam sed nibh ipsum. Etiam at felis a velit eleifend ultrices. Quisque vitae enim imperdiet, consectetur magna in, vestibulum sem. Mauris sagittis turpis diam, eu porta erat facilisis nec. Curabitur interdum turpis nec ligula congue volutpat sit amet a quam.</p>
							</div>
						</div>
					</div>
					<div class="post-list-wrapper">
						@for ($i = 0; $i < 4; $i++)
						<div class="item">
							<a href="" class="absolute-link"></a>
							<div class="thumb" style="background-image:url('<?php echo "/assets/images/post-test-img-" . ($i + 1) . ".jpg" ?>')"></div>
							<div class="contents">
								<h2 class="title">Aliquam et lacus lacinia</h2>
								<p class="sub-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
								<div class="editor">
									<div class="profile-image-wrapper">
										<img src="/assets/images/faces/tim.jpg" alt="">
									</div>
									<span class="name">팀 쿡</span>
								</div>
							</div>
						</div>
						@endfor
					</div>
				</div>
			</div>
		</section>
	</main>
@endsection
