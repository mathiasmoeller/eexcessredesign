(function () {
    'use strict';

    function ParagraphCtrl($scope) {
        $scope.query = function () {
            alert("yey");
        }
    }

    angular
        .module('eRedesign')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
