@extends('layouts.base')

@section('title')
	<title>Povium | 좋은 글, 세상을 바꾸는 힘</title>
@endsection

@section('content')
	<main id="home-main">
		<section class="post-section">
			<h1 class="section-title"><a class="link" href="">인기 포스트</a></h1>
			<div class="post-scroll-area">
				<div class="post-container">
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/qualcomm.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Qualcomm’s new 4G, 5G platforms to bring improved telecommunication to vehicles</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/galaxy-fold.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Behold the Samsung Galaxy Fold under glass</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/3.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Fortnite goes big on esports for 2019 with $100 million prize pool</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/4.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Group of employees calls for end to Microsoft's $480M HoloLens military contract</h1>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="post-section">
			<h1 class="section-title"><a class="link" href="">테크놀로지</a></h1>
			<div class="post-scroll-area">
				<div class="post-container">
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/coin.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">SME lender Validus Capital raises $15M for expansion in Southeast Asia</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/fb.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Facebook expands its internet infrastructure projects</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/bmw-ai.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">BMW makes interacting with you car’s AI systems more natural</h1>
						</div>
					</div>
					<div class="post-item">
						<div class="image-placeholder">
							<img class="image" src="/assets/images/sets/nubia.jpg" alt="">
						</div>
						<div class="post-content">
							<h1 class="post-title">Nubia’s ‘wearable smartphone’ might be the next step for flexible displays</h1>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
@endsection