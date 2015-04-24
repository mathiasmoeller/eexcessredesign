(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce) {
        $scope.iconSource = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/query-icon.svg');
        $scope.showQueryButton = false;

        $scope.query = function () {
            ER.messaging.callBG({method: {parent: 'keywords', func: 'getParagraphEntities'}, data: $scope.paragraph}, function(result) {
                console.log("getParagraphEntities results are: ");
                console.log(result);
            });
        };

        console.log("paragraph is");
        console.log($scope.paragraph);
    }

    angular
        .module('eRedesign')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
