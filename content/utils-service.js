(function () {

    'use strict';

    function Utils() {
        var _extID = chrome.i18n.getMessage('@@extension_id'); // chrome extension identifier

        return {
            getExtID: function () {
                return _extID;
            }
        };
    }

    angular
        .module('Jarvis')
        .factory('Utils', Utils);

})();



