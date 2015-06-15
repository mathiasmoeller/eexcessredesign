(function () {
    'use strict';

    function SettingsCtrl($scope, $timeout) {
        $scope.settings = {};
        $scope.languages = [
            {
                abbrev: 'fr',
                name: 'French'
            },
            {
                abbrev: 'en',
                name: 'English'
            },
            {
                abbrev: 'de',
                name: 'German'
            },
            {
                abbrev: '',
                name: 'All languages'
            }
        ];

        chrome.storage.sync.get('JarvisSettings', function (data) {
            if (data && data.JarvisSettings) {
                $scope.onlyOpen = data.JarvisSettings.onlyOpen;
                $scope.resultNumber = data.JarvisSettings.resultNumber;
                $scope.language = data.JarvisSettings.language;
                $scope.$apply();
            }
        });


        $scope.save = function () {
            chrome.storage.sync.set({
                'JarvisSettings': {
                    onlyOpen: $scope.onlyOpen,
                    resultNumber: $scope.resultNumber,
                    language: $scope.language
                }
            }, function () {
                $scope.feedback = 'saved';

                $timeout(function () {
                    $scope.feedback = '';
                }, 3000);
            });
        };

        $scope.feedback = undefined;
    }

    angular
        .module('JarvisSettings')
        .controller('SettingsCtrl', SettingsCtrl);
})();
