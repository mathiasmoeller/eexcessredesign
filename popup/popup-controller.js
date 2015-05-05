(function () {
    'use strict';

    function PopupCtrl($scope) {
        var extID = chrome.i18n.getMessage('@@extension_id');
        $scope.linkToSettings = "chrome://extensions?options=" + extID;
        console.log($scope.linkToSettings);

        $scope.toggleApplication = true;

        $scope.$watch('toggleApplication', function () {
            console.log("watcher");
            chrome.tabs.query({active: true}, function (tab) {
                var tabID = tab[0].id;
                var eRedesign = {};
                eRedesign[tabID] = $scope.toggleApplication;

                chrome.storage.sync.set({'eRedesign': eRedesign}, function () {
                    console.log("success");
                });
            });
        });
    }

    angular
        .module('eRedesignPopup')
        .controller('PopupCtrl', PopupCtrl);
})();
