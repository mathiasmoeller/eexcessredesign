(function () {
    'use strict';

    function ResultDialogCtrl($scope, $sce, $mdDialog, results, selectedTab) {
        $scope.results = results;
        $scope.selectedTab = selectedTab;

        $scope.hide = function () {
            $mdDialog.hide();
        }
    }

    angular
        .module('eRedesign')
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