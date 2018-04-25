window.onload = function() {
    //
    (function (window, document, undefined) {

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
            }
        }
        document.querySelector('.home-search-input-wrapper .magnifier').addEventListener('click', activeHomeSearch, false);

        // document.querySelector('body').addEventListener('click', function (event) {
        //     var clickedTarget = event.target;
        //     console.log(clickedTarget);
        //     if (!clickedTarget.classList.contains('home-search-input-wrapper')) {
        //         deactiveHomeSearch();
        //     }
        //
        //
        // });

    }(window, document));
};
