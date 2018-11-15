@extends('layouts.base')

@section('content')

<main id="home-main">

    <section id="popular" class="post-section">

        <div class="post-view">
            <div class="guided-view">
                <ul class="post-container" data-post-pos="0">
                    @for ($i = 0; $i < sizeof($post_img_link); $i++)
                    <li class="post-wrapper">
                        <div class="post">
                            <a class="post-link" href="/register"></a>
                            <img class="hero" src="/assets/images/sets/{{$post_img_link[$i]}}.jpg" alt="">
                            <div class="post-contents">
                                <h1>{{$post_title[$i]}}</h1>
                                <span class="writer-name">- {{$post_writer[$i]}} -</span>
                            </div>
                        </div>
                    </li>
                    @endfor
                </ul>
            </div>
        </div>

    </section>

</main>

@endsection

@section('script_sub')
    <script src="/build/js/main.built.js"></script>
@endsection
