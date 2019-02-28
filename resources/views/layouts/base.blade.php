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

		<div id="povium-app-view">
			@include('sections.globalnav-new')

			<div id="povium-content">
				@yield('content')
				
				@include('sections.globalfooter')
			</div>
		</div>

		@include('sections.post-view')
		
	</body>

</html>
