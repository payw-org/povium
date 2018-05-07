$(document).ready(function($) {

    'use strict';

    // 네비게이션 검색 입력창 확장
    function expandSearchInput() {
        $('#gn-search-ui').addClass('active')
        $('#gn-search-input').focus();
    }

    function foldSearchInput() {
        $('#gn-search-ui').removeClass('active')
    }

    $('#gn-search-ui .magnifier').on('click', function () {
        if ($(this).hasClass('active')) {
            // 검색 시작
        } else {
            expandSearchInput()
        }
    })

    $(window).on('click', function (e) {
        var clickedTarget = e.target
        if (!clickedTarget.classList.contains('magnifier') && clickedTarget.id !== 'gn-search-input') {
            foldSearchInput()
        }
    })

})
