(function () {
    'use strict';

    function PopupCtrl($scope) {
        $scope.settings = {};

        $scope.save = function () {
            chrome.storage.sync.set({'eRedesignSettings': $scope.settings}, function() {
                alert("saved");
            })
        }
    }

    angular
        .module('eRedesignPopup')
        .controller('PopupCtrl', PopupCtrl);
})();
