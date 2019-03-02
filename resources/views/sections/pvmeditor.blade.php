@extends('layouts.editor')

@section('title')
	<title>Povium | 에디터</title>
@endsection

@section('css_sub')
	<link rel="stylesheet" href="/build/css/editor.new.built.css">
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
			<button class="fpa">Fix paste area</button>
			<button class="fpa-p1">Fix paste area phase 1</button>
			<button class="fpa-p2">Fix paste area phase 2</button>
			<button class="fpa-p3">Fix paste area phase 3</button>
			<button class="fpa-p4">Fix paste area phase 4</button>
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
		{{-- <textarea class="paste-textarea"></textarea> --}}
	</div>

	<script src="/build/js/editor.new.built.js"></script>

@endsection
