(function () {
    'use strict';

    function PopupCtrl($scope) {

        $scope.toggleApplication = true;

        $scope.showSettings = function () {
            alert("yey");
        };
    }

    angular
        .module('eRedesignPopup')
        .controller('PopupCtrl', PopupCtrl);
})();
