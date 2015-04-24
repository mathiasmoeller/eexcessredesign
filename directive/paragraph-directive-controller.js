(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce) {
        $scope.iconSource = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/query-icon.svg');
        $scope.showQueryButton = false;
        $scope.keywords = [];

        $scope.query = function () {
            // outgoing paragraph has to be in a list. this is requested by the api of the REST service
            var paragraph = [ER.paragraphs.getParagraph($scope.id)];
            $scope.queried = true;

            ER.messaging.callBG({
                method: {parent: 'keywords', func: 'getParagraphEntities'},
                data: paragraph
            }, function (result) {
                $scope.keywords = result.paragraphs[0].statistic;
                console.log(result);
            });
        };
    }

    angular
        .module('eRedesign')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
