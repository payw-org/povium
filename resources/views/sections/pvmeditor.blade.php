@extends('layouts.editor')

@section('title')
	<title>Povium | 에디터</title>
@endsection

@section('content')

	<div id="post-editor">

		<div id="error" class="hidden">
			<div class="banner">에러가 발생했습니다.</div>
		</div>

		<div id="editor-toolbar">

			<div class="et-items">
				<button id="p" type="button" title="본문"></button>
				<button id="h1" type="button" title="제목1"></button>
				<button id="h2" type="button" title="제목2"></button>
				<button id="h3" type="button" title="제목3"></button>

				<button id="bold" type="button" title="굵게"></button>
				<button id="italic" type="button" title="기울임"></button>
				<button id="underline" type="button" title="밑줄"></button>
				<button id="strike" type="button" title="취소선"></button>

				<button id="align-left" title="왼쪽 정렬"></button>
				<button id="align-center" title="가운데 정렬"></button>
				<button id="align-right" title="오른쪽 정렬"></button>

				<button id="ol" title="순서 있는 목록"></button>
				<button id="ul" title="순서 없는 목록"></button>
				<button id="link" title="링크"></button>
				<button id="blockquote" title="인용구"></button>

				<!-- <div style="display: none;"> -->
					<button id="log-range"></button>
					<button id="nodes-in-selection"></button>
					<button id="separate"></button>
					<button id="split-text"></button>

					<button id="get-sel-pos"></button>
					<button id="get-sel-pos-par"></button>
				<!-- </div> -->
			</div>



		</div>
		<div id="caret"></div>
		<aside id="poptool">
			<div class="pack top-categories">
				<button class="operation" id="pt-title-pack"></button>
				<button class="operation" id="pt-textstyle-pack"></button>
				<button class="operation" id="pt-align-pack"></button>
				<button class="operation" id="pt-link"></button>
				<button class="operation" id="pt-blockquote"></button>
			</div>
			<div class="pack title-style hidden">
				<!-- <button id="pt-p"></button> -->
				<button class="operation" id="pt-h1"></button>
				<button class="operation" id="pt-h2"></button>
				<button class="operation" id="pt-h3"></button>
			</div>
			<div class="pack text-style hidden">
				<button class="operation" id="pt-bold" type="button" name="button"></button>
				<button class="operation" id="pt-italic" type="button"></button>
				<button class="operation" id="pt-underline" type="button"></button>
				<button class="operation" id="pt-strike" type="button"></button>
			</div>
			<div class="pack align hidden">
				<button class="operation" id="pt-alignleft" type="button" name="button"></button>
				<button class="operation" id="pt-alignmiddle" type="button"></button>
				<button class="operation" id="pt-alignright" type="button"></button>
			</div>
			<div class="pack input hidden"> 
				<input type="text" placeholder="url">
			</div>
		</aside>
		<div id="image-preference-view">
			<button id="full"></button>
			<button id="large"></button>
			<button id="fit"></button>
			<button id="float-left"></button>
		</div>
		<div id="editor-body" contenteditable="true" autocomplete="off" spellcheck="false"><ul><li data-ni="9">aa</li></ul><h1 data-ni="1">Did History <b>Really Happen?</b></h1><ol><li data-ni="17">haha</li><li data-ni="18">haha</li></ol><figure class="image caption-enabled full" data-ni="2"><div class="image-wrapper" contenteditable="false"><img src="/assets/images/sets/ex.jpeg" alt=""></div><figcaption contenteditable="true">Frederick Dielman, “History” (1896)</figcaption></figure><blockquote data-ni="3">This article is part of the Boundary Hunter column.</blockquote><ul><li data-ni="4">hihi</li><li data-ni="5">hoho</li></ul><p data-ni="6">The biggest revolution in the field of history, these last four decades, has been the recognition that traditional histories — historical narratives — are as much narrative as they are history, and that that distinction matters.</p><figure class="image" data-ni="7"><div class="image-wrapper" contenteditable="false"><img src="/assets/images/sets/separator.png" alt=""></div><figcaption contenteditable="true"></figcaption></figure><p data-ni="8">When you are digging in the earth, no one ever announces “chapter two.”</p><ul><li data-ni="10">hello</li><li data-ni="11">world</li><li data-ni="15">eifhwih</li></ul><p data-ni="12">interception</p><ul><li data-ni="13">안녕</li><li data-ni="14">세상</li><li data-ni="16">ㅇㅎ</li></ul></div>

		<div id="paste-area" contenteditable="true"></div>
	</div>

	<script src="/build/js/editor.new.built.js"></script>

@endsection
