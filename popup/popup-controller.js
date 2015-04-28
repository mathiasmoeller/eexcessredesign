(function () {
    'use strict';

    function PopupCtrl($scope) {
        var extID = chrome.i18n.getMessage('@@extension_id');
        $scope.linkToSettings = "chrome://extensions?options=" + extID;
        console.log($scope.linkToSettings);

        $scope.toggleApplication = true;

        $scope.showSettings = function () {
            chrome.tabs.query({active: true}, function(tab) {
                console.log(tab);
                chrome.tabs.sendMessage(tab[0].id, "hello there");
            });



        };
    }

    angular
        .module('eRedesignPopup')
        .controller('PopupCtrl', PopupCtrl);
})();
