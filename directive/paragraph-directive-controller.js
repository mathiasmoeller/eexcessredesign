(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce, $mdDialog) {
        $scope.icons = {};
        $scope.icons.query = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/query-icon.svg');
        $scope.icons.image = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/image-icon.svg');
        $scope.icons.text = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/text-icon.svg');
        $scope.icons.video = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/video-icon.svg');

        $scope.showQueryButton = false;
        $scope.keywords = [];
        var results = {};

        $scope.query = function () {
            if ($scope.keywords.length === 0) {

                // outgoing paragraph has to be in a list. this is requested by the api of the REST service
                var paragraph = [ER.paragraphs.getParagraph($scope.id)];
                $scope.queried = true;

                ER.messaging.callBG({
                    method: {service: 'KeywordService', func: 'getParagraphEntities'},
                    data: paragraph
                }, function (result) {
                    angular.forEach(result.paragraphs[0].statistic, function(elem) {
                        if (elem.key.text !== "") {
                            $scope.keywords.push(elem.key.text);
                        }
                    });

                    console.log($scope.keywords);
                });
            }

            else {
                // Query europeana
                ER.messaging.callBG({
                    method: {service: 'EuService', func: 'query'},
                    data: $scope.keywords
                }, function (result) {
                    console.log(result);
                });
            }
        };

        $scope.showTextResults= function(event) {
            $mdDialog.show({
                templateUrl: $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/result-dialog/result-dialog.html'),
                controller: 'ResultDialogCtrl',
                resolve: {
                    results: function () {
                        return results;
                    }
                },
                targetEvent: event
            }).then(function (changedObject) {

            });
        }
    }

    angular
        .module('eRedesign')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
