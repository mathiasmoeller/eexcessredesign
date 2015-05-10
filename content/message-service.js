(function () {

    'use strict';

    function MessageService(Utils) {
        var _extID = Utils.getExtID();

        /**
         * Sends a message to the background script
         *
         * @param {Object} message The message to send
         * @param {Function} callback Function to be called by the receiver
         */
        var _callBG = function(message, callback) {
            if (typeof callback !== 'undefined') {
                chrome.runtime.sendMessage(_extID, message, callback);
            } else {
                chrome.runtime.sendMessage(_extID, message);
            }
        };

        return {
            callBG: _callBG
        };
    }

    angular
        .module('Jarvis')
        .factory('MessageService', MessageService);

})();



