@extends('layouts.editor')

@section('title')
	<title>Povium | 에디터</title>
@endsection

@section('content')

	<div id="post-editor">

		<div id="error" class="hidden">
			<div class="banner">에러가 발생했습니다.</div>
		</div>

		<div class="debug" style="position:fixed;z-index:9999;top:0;right:0;">
			<button class="gcn">Get current node</button>
			<button class="gcs">Get current JS range</button>
			<button class="gcpr">Get current PVMRange</button>
			<button class="gnir">Get Nodes in range</button>
			<button class="gcnl">Get all nodes' list</button>
			<button class="converter-stringify">Convert to JSON</button>
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
		<div id="editor-body" contenteditable="true" autocomplete="off" spellcheck="false"></div>

		<div id="paste-area" contenteditable="true"></div>
	</div>

	<script src="/build/js/editor.new.built.js"></script>

@endsection
