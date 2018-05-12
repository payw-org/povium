window.onload = function() {

    'use strict';

    // 네비게이션 검색 입력창 확장
    function expandSearchInput() {
        $('#globalnav').addClass('search-active');
        $('#gn-search-input').focus();
    }

    function foldSearchInput() {
        $('#globalnav').removeClass('search-active');
		$('#gn-search-result').removeClass('active');
    }

	function loadSearchResult(searchResult) {

	}

	// globalnav 검색창에 입력을 시작할 때
	$('#gn-search-input').on('keyup', function() {
		var $searchResultWindow = $('#gn-search-result-view');
		var keyword = $(this).val();
		if (keyword !== "") {
			$searchResultWindow.addClass('active');
		} else {
			$searchResultWindow.removeClass('active');
		}
	})

    $('#gn-search .magnifier').on('click', function() {
		console.log("dfdf");
        if ($('#globalnav').hasClass('search-active')) {
            // 검색
            console.warn('검색 시작');
        } else {
            expandSearchInput();
        }
    })

	$('#gn-search-input').on('keydown', function(e) {
		if (e.which === 27) {
			foldSearchInput();
		}
	})

    $(window).on('click', function(e) {
        var clickedTarget = e.target;
        if (!clickedTarget.classList.contains('magnifier') && clickedTarget.id !== 'gn-search-input') {
            foldSearchInput();
        }
    })

}
