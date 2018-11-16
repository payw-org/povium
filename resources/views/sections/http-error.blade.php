@extends('layouts.base')

@section('title')
	<title>Povium | {{$title}}</title>
@endsection

@section('content')
	<main id="error-main">
		<h1>{{$heading}}</h1>
		<h2>{{$details}}</h2>
	</main>
@endsection
