<nav id="globalnav">

    <div id="gn-backface">
        <div id="gn-container">
            <div id="gn-search">
                <div id="gn-search-input-wrapper">
                    <div id="gn-search-ui">
                        <input id="gn-search-input" type="text" name="" value="" placeholder="검색" autocomplete="off">
                        <button class="magnifier"></button>
                    </div>
                </div>

                <aside id="gn-search-result-view">
                    <ol id="gn-sr-list">
                        <a class="gn-sr-link">
                            <li class="gn-sr-item"></li>
                        </a>
                    </ol>
                </aside>
            </div>

            <div id="gn-logo-wrapper">
                <a id="gn-home-link" href="/"></a>
            </div>

            @if ($is_logged_in)

            <div id="gn-loggedin-view">
                <div class="container">
                    <a href="" class="user-info">
                        <div class="bg"></div>
                        <span>{{$current_user['name']}}</span>
                    </a>
                    <a href="/logout" class="sign-out full-load">
                        <div class="bg"></div>
                        <span>로그아웃</span>
                    </a>
                </div>
            </div>

            @else

            <div id="gn-sign-register">
                <div class="container">
                    <a href="/login" class="sign-in">
                        <div class="bg"></div>
                        <span>로그인</span>
                    </a>
                    <a href="/register" class="register">
                        <div class="bg"></div>
                        <span>회원가입</span>
                    </a>
                </div>
            </div>

            @endif

            <button class="mobile-btn">
                <span class="block1"></span>
                <span class="block2"></span>
            </button>

        </div>

        <aside class="mobile-menu">
            <nav>
                <ol>
                    <li class="gn-m-item">
                        <a class="gn-m-link" href="/login">로그인</a>
                    </li>

                    <li class="gn-m-item">
                        <a class="gn-m-link" href="/register">회원가입</a>
                    </li>
                </ol>
            </nav>
        </aside>

    </div>
    <div id="gn-search-backface"></div>

</nav>
