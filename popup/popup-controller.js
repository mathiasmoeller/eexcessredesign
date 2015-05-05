(function () {
    'use strict';

    function PopupCtrl($scope) {
        var extID = chrome.i18n.getMessage('@@extension_id');
        $scope.linkToSettings = "chrome://extensions?options=" + extID;
        $scope.application = {};
        chrome.storage.sync.get('eRedesign', function (data) {
            chrome.tabs.query({active: true}, function (tab) {
                var tabID = tab[0].id;
                if (data && data.eRedesign && data.eRedesign[tabID] !== undefined) {
                    $scope.application.showApp = data.eRedesign[tabID];
                    console.log("yey");
                }
                else {
                    $scope.application.showApp = true;
                    console.log("no");
                }
                $scope.$apply();
            });

        });

        $scope.$watch('application.showApp', function () {
            chrome.tabs.query({active: true}, function (tab) {
                var tabID = tab[0].id;
                var eRedesign = {};
                eRedesign[tabID] = $scope.application.showApp;

                chrome.storage.sync.set({'eRedesign': eRedesign}, function () {
                    console.log("success");
                });
            });
        });
    }

    angular
        .module('eRedesignPopup')
        .controller('PopupCtrl', PopupCtrl);
})
();
