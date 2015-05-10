(function () {
    'use strict';

    function BackgroundCtrl() {
        chrome.browserAction.setPopup({
            popup: "../popup/popup.html"
        });
    }

    angular
        .module('JarvisBG')
        .controller('BackgroundCtrl', BackgroundCtrl);
})();
