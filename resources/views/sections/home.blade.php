@extends('layouts.base')

@section('title')
	<title>Povium | 좋은 글, 세상을 바꾸는 힘</title>
@endsection

@section('content')
	<main id="home-main">

		<section id="popular" class="post-section">

			<div class="post-view">
				<div class="guided-view">
					<ul class="post-container" data-post-pos="0">
						@foreach ($posts as $post)
							<li class="post-wrapper">
								<div class="post">
									<a class="post-link" href="/register"></a>
									<img class="hero" src="/assets/images/sets/{{$post['img']}}.jpg" alt="">
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

		</section>

	</main>
@endsection
