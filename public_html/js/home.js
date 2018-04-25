window.onload = function() {
    //
    (function (window, document, undefined) {
        'use strict';

        function deactiveHomeSearch() {
            //
            var searchElm = document.querySelector('.home-search-input-wrapper');
            if (searchElm.classList.contains('active')) {
                searchElm.classList.remove('active');
            } else {

            }
        }
        function activeHomeSearch() {
            //
            var searchElm = document.querySelector('.home-search-input-wrapper');
            if (searchElm.classList.contains('active')) {
                // Start searching when input is active
            } else {
                searchElm.classList.add('active');
                searchElm.querySelector('.home-search-input').focus();
            }
        }

        document.addEventListener('click', function (event) {
            var clickedTarget = event.target;

            // If click magnifier icon
            // activate search
            if (clickedTarget.classList.contains('magnifier')) {
                if (clickedTarget.parentElement.classList.contains('active')) {
                    // Do search
                } else {
                    activeHomeSearch();
                }
            } else if (!clickedTarget.classList.contains('home-search-input')
            && !clickedTarget.classList.contains('home-search-input-wrapper')) {
                // Click outside the search area
                // deactivate search input
                deactiveHomeSearch();
            }
        });

        //
        Number(getComputedStyle(document.body, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);

    }(window, document));
};
