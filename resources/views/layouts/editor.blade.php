<!DOCTYPE html>
<html>

	<head>
		@include('global-inclusion.global-meta')

		@yield('head_meta_sub')

		<title>{{$title}}</title>

		@include('global-inclusion.global-css')

		@yield('css_sub')
	</head>

	<body>
		@yield('content')
		@include('global-inclusion.global-script')
	</body>

</html>