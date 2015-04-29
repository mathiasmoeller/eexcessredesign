(function () {
    'use strict';

    function SettingsCtrl($scope) {
        $scope.settings = {};

        chrome.storage.sync.get('eRedesignSettings', function(data) {
            if (data && data.eRedesignSettings) {
                $scope.onlyOpen = data.eRedesignSettings.onlyOpen;
                $scope.resultNumber = data.eRedesignSettings.resultNumber;
                $scope.$apply();
            }
        });

        $scope.save = function () {
            chrome.storage.sync.set({'eRedesignSettings': {onlyOpen: $scope.onlyOpen, resultNumber: $scope.resultNumber}});
        }
    }

    angular
        .module('eRedesignSettings')
        .controller('SettingsCtrl', SettingsCtrl);
})();
