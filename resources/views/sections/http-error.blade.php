@extends('layouts.base')

@section('title')
	<title>Povium | {{$error['title']}}</title>
@endsection

@section('content')
	<main id="error-main">
		<h1>{{$error['heading']}}</h1>
		<h2>{{$error['details']}}</h2>
	</main>
@endsection
