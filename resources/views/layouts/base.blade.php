<html>

    <head>
        @include('global-inclusion.global-meta')

        @yield('head_meta_sub')

        <title>{{$title}}</title>

        @include('global-inclusion.global-css')

        @yield('css_sub')
    </head>

    <body>
        @include('layouts.globalnav')

        @yield('content')

        @include('layouts.globalfooter')

        @include('global-inclusion.global-script')

        @yield('script_sub')
    </body>

</html>
