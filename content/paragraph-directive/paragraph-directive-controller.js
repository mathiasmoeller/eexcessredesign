(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce, $mdDialog, HighlightService) {
        $scope.icons = {};
        $scope.icons.query = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/query-icon.svg');
        $scope.icons.search = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/search-icon.svg');
        $scope.icons.image = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/image-icon.svg');
        $scope.icons.text = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/text-icon.svg');
        $scope.icons.video = $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/media/icons/video-icon.svg');
        $scope.keywords = [];

        var queryResults = undefined;

        // Check if plugin is disabled or not
        chrome.storage.onChanged.addListener(function (changes) {
            if (changes.eRedesign) {
                var storageValue = changes.eRedesign.newValue;
                ER.messaging.callBG({
                    method: {service: 'UtilsService', func: 'getCurrentTabID'}
                }, function (tabID) {

                    if (storageValue[tabID] !== undefined) {
                        $scope.showPlugin = storageValue[tabID];
                    }
                    $scope.$apply();
                });
            }
        });

        // Depending if there are keywords or not this method queries keywords from the current paragraph
        // or sends a query with the given keywords to europeana
        $scope.query = function () {
            if ($scope.keywords.length === 0) {

                // outgoing paragraph has to be in a list. this is requested by the api of the REST service
                var paragraph = [ER.paragraphs.getParagraph($scope.id)];

                ER.messaging.callBG({
                    method: {service: 'KeywordService', func: 'getParagraphEntities'},
                    data: paragraph
                }, function (result) {
                    angular.forEach(result.paragraphs[0].statistic, function (elem) {
                        if (elem.key.text !== "") {
                            $scope.keywords.push(elem.key.text);
                        }
                    });

                    $scope.keywordsFound = true;
                    $scope.$apply();
                });
            }

            else {
                // Query europeana
                ER.messaging.callBG({
                    method: {service: 'EuService', func: 'query'},
                    data: $scope.keywords
                }, function (result) {
                    queryResults = result.items;
                    $scope.textResults = 0;
                    $scope.imageResults = 0;
                    $scope.avResults = 0;

                    angular.forEach(queryResults, function (item) {
                        if (item.type === 'TEXT') {
                            $scope.textResults++;
                        } else if (item.type === 'IMAGE' || item.type === '3D') {
                            $scope.imageResults++;
                        } else {
                            $scope.avResults++;
                        }
                    });

                    $scope.queried = true;
                    $scope.keywordsFound = true;
                    $scope.$apply();
                });
            }
        };

        // Watch for keyword changes to highlight the current keywords
        $scope.$watch('keywords', function() {
            HighlightService.removeHighlight($scope.id);
            angular.forEach($scope.keywords, function(keyword) {
                HighlightService.highlight($scope.id, keyword);
            })
        }, true);

        // Show a dialog with all found results
        $scope.showResults = function (event, selectedTab) {
            $mdDialog.show({
                templateUrl: $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/content/result-dialog/result-dialog.html'),
                controller: 'ResultDialogCtrl',
                resolve: {
                    results: function () {
                        return queryResults;
                    },
                    selectedTab: function () {
                        return selectedTab;
                    }
                },
                targetEvent: event
            });
        }
    }

    angular
        .module('eRedesign')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
