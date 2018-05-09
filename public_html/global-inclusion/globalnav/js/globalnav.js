$(document).ready(function($) {

    'use strict';

    // 네비게이션 검색 입력창 확장
    function expandSearchInput() {
        $('#globalnav').addClass('search-active');
        $('#gn-search-input').focus();
    }

    function foldSearchInput() {
        $('#globalnav').removeClass('search-active');
    }

    $('#gn-search .magnifier').on('click', function () {
        if ($('#globalnav').hasClass('search-active')) {
            // 검색
            console.warn('검색 시작');
        } else {
            expandSearchInput();
        }
    })

    $(window).on('click', function (e) {
        var clickedTarget = e.target;
        if (!clickedTarget.classList.contains('magnifier') && clickedTarget.id !== 'gn-search-input') {
            foldSearchInput();
        }
    })

})
