(function () {
    'use strict';

    function PopupCtrl($scope) {
        var extID = chrome.i18n.getMessage('@@extension_id');
        var linkToSettings = "chrome://extensions?options=" + extID;

        // The application.showApp needs to be a unshallow object. Don't ask why. I dare you. I double dare you.
        $scope.application = {};

        // Check if the plugin is disabled or enabled. If no data is found enable it (first startup)
        chrome.storage.sync.get('Jarvis', function (data) {
                if (data && data.Jarvis !== undefined) {
                    $scope.application.showApp = data.Jarvis;
                } else {
                    $scope.application.showApp = true;
                }
                $scope.$apply();
        });

        // Save the value of showApp to the storage
        $scope.$watch('application.showApp', function () {
                chrome.storage.sync.set({'Jarvis': $scope.application.showApp});
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
