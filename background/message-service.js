(function () {

    'use strict';

    function MessageService(EuService, KeywordService) {
        var service = {};
        service.EuService = EuService;
        service.KeywordService = KeywordService;

        console.log("reached MEssageservice");

        var _sendMsgTab = function(tabID, msg, callback) {
            if (typeof callback !== 'undefined') {
                chrome.tabs.sendMessage(tabID, msg, callback);
            } else {
                chrome.tabs.sendMessage(tabID, msg);
            }
        };

        var _sendMsgAllTabs = function(msg, callback) {
            chrome.tabs.query({}, function(tabs) {
                for (var i = 0, len = tabs.length; i < len; i++) {
                    if (typeof callback !== 'undefined') {
                        chrome.tabs.sendMessage(tabs[i].id, msg, callback);
                    } else {
                        chrome.tabs.sendMessage(tabs[i].id, msg);
                    }
                }
            });
        };

        chrome.runtime.onMessage.addListener(function (request, sender, response) {
            console.log("trying to send");
            console.log(request);

            if (typeof sender.tab === 'undefined') {
                // sender cannot be identified, exit
                console.log('no tab');
            } else {
                var tabID = sender.tab.id;
                // call function as specfied by the request
                service[request.method.service][request.method.func](tabID, request.data, response);
                return true;
            }
        });

        return {
            sendMsgTab: _sendMsgTab,
            sendMsgAllTabs: _sendMsgAllTabs
        }
    }

    angular
        .module('eRedesignBG')
        .factory('MessageService', MessageService)
        .run(function (MessageService) {
            // call MessageService in run function so it can listen to all events from beginning on.
        });

})();



