(function () {
    'use strict';

    function PopupCtrl($scope) {
        var extID = chrome.i18n.getMessage('@@extension_id');
        var linkToSettings = "chrome://extensions?options=" + extID;

        // The application.showApp needs to be a unshallow object. Don't ask why. I dare you. I double dare you.
        $scope.application = {};

        // Check if the plugin is disabled or enabled. If no data is found enable it (first startup)
        chrome.storage.sync.get('Jarvis', function (data) {
            chrome.tabs.query({active: true}, function (tab) {
                var tabID = tab[0].id;
                if (data && data.Jarvis && data.Jarvis[tabID] !== undefined) {
                    $scope.application.showApp = data.Jarvis[tabID];
                }
                else {
                    $scope.application.showApp = true;
                }
                $scope.$apply();
            });

        });

        // Save the value of showApp to the storage
        $scope.$watch('application.showApp', function () {
            chrome.tabs.query({active: true}, function (tab) {
                var tabID = tab[0].id;
                var Jarvis = {};
                Jarvis[tabID] = $scope.application.showApp;

                chrome.storage.sync.set({'Jarvis': Jarvis});
            });
        });

        $scope.showSettings = function () {
            chrome.tabs.create({url: linkToSettings});
        }
    }

    angular
        .module('JarvisPopup')
        .controller('PopupCtrl', PopupCtrl);
})
();
