(function () {
    'use strict';

    function ResultDialogCtrl($scope, $sce, $mdDialog, results, selectedTab) {
        $scope.results = results;
        console.log($scope.results);
        $scope.selectedTab = selectedTab;
        var detailDialog;

        $scope.hide = function () {
            $mdDialog.hide();
        };
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