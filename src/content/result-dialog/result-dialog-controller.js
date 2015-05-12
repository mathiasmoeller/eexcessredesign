(function () {
    'use strict';

    function ResultDialogCtrl($scope, $mdDialog, results, selectedTab, resultNumbers) {
        $scope.results = results;
        $scope.selectedTab = selectedTab;
        $scope.resultNums = resultNumbers;
        $scope.videoFallback = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fbdh-rd.bne.es%2Fimg%2Fvideo.png&size=FULL_DOC&type=VIDEO";
        $scope.textFallback = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fbdh-rd.bne.es%2Fimg%2Ftext.png&size=FULL_DOC&type=TEXT";
        $scope.imageFallback = "http://europeanastatic.eu/api/image?uri=http%3A%2F%2Fbdh-rd.bne.es%2Fimg%2Fimage.png&size=FULL_DOC&type=IMAGE";

        $scope.hide = function () {
            $mdDialog.hide();
        };
    }

    angular
        .module('Jarvis')
        .controller('ResultDialogCtrl', ResultDialogCtrl)
        .filter('resultFilter', function () {
            return function (results, types) {
                var out = [];
                angular.forEach(results, function (value) {
                    if (types[value.type] === true) {
                        out.push(value);
                    }
                });
                return out;
            };
        });
})();