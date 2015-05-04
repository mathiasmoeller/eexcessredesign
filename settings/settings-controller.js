(function () {
    'use strict';

    function SettingsCtrl($scope, $timeout) {
        $scope.settings = {};

        chrome.storage.sync.get('eRedesignSettings', function(data) {
            if (data && data.eRedesignSettings) {
                $scope.onlyOpen = data.eRedesignSettings.onlyOpen;
                $scope.resultNumber = data.eRedesignSettings.resultNumber;
                $scope.$apply();
            }
        });


        $scope.save = function () {
            chrome.storage.sync.set({'eRedesignSettings': {onlyOpen: $scope.onlyOpen, resultNumber: $scope.resultNumber}}, function() {
                $scope.feedback = 'saved';

                $timeout(function() {
                    $scope.feedback = '';
                }, 2000);
            });
        };

        $scope.feedback = undefined;
    }

    angular
        .module('eRedesignSettings')
        .controller('SettingsCtrl', SettingsCtrl);
})();
