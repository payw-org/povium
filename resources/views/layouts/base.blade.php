<!DOCTYPE html>
<html>

	<head>
		@include('global-inclusion.global-meta')

		@yield('head_meta_sub')

		@yield('title')

		@include('global-inclusion.global-css')

		@yield('css_sub')

		@include('global-inclusion.global-script')
	</head>

	<body>

		<povium-app>
			@include('sections.globalnav')

			@yield('content')

			@include('sections.globalfooter')
		</povium-app>

		
	</body>

</html>
