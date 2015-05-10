(function () {
    'use strict';

    function DetailDialogCtrl($scope, $mdDialog, data) {
        $scope.data = data;
        console.log($scope.data);

        $scope.hide = function () {
            $mdDialog.hide();
        };
    }

    angular
        .module('Jarvis')
        .controller('DetailDialogCtrl', DetailDialogCtrl);
})();