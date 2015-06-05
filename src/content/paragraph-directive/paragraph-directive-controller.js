(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce, $mdDialog, HighlightService, MessageService, Utils, ParagraphDetectionService) {
        var _extID = Utils.getExtID();

        // the paragraph wrapped by the directive
        var paragraph = ParagraphDetectionService.getParagraph($scope.id);

        // icons that are used in the directive
        $scope.icons = {};
        $scope.icons.search = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/search-icon.svg');
        $scope.icons.play = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/play-icon.svg');
        $scope.icons.image = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/image-icon.svg');
        $scope.icons.text = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/text-icon.svg');
        $scope.icons.video = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/video-icon.svg');

        // Must be a deep object to prevent problems with the watcher
        $scope.keywords = {};
        $scope.keywords.words = [];
        $scope.newKeywords = true;

        var queryResults = undefined;

        // Load the initial value from the storage
        chrome.storage.sync.get('Jarvis', function (data) {
            if (data.Jarvis) {
                MessageService.callBG({
                    method: {service: 'UtilsService', func: 'getCurrentTabID'}
                }, function (tabID) {

                    if (data.Jarvis[tabID.data] !== undefined) {
                        $scope.showPlugin = data.Jarvis[tabID.data];
                    }
                    $scope.$apply();
                });
            }
        });


        // Set listener who listens for changes in the storage
        chrome.storage.onChanged.addListener(function (changes) {
            if (changes.Jarvis) {
                var storageValue = changes.Jarvis.newValue;
                MessageService.callBG({
                    method: {service: 'UtilsService', func: 'getCurrentTabID'}
                }, function (tabID) {

                    if (storageValue[tabID.data] !== undefined) {
                        $scope.showPlugin = storageValue[tabID.data];
                    }
                    $scope.$apply();
                });
            }
        });

        // Searches for keywords and sends a query to europeana afterwards
        $scope.query = function () {
            if ($scope.keywords.words.length === 0) {
                // outgoing paragraph has to be in a list. this is requested by the api of the REST service
                var outgoingParagraph = [paragraph];

                MessageService.callBG({
                    method: {service: 'KeywordService', func: 'getParagraphEntities'},
                    data: outgoingParagraph
                }, function (result) {
                    if (result.type === 'success') {
                        angular.forEach(result.data, function (elem) {
                            if ($scope.keywords.words.indexOf(elem) === -1) {
                                $scope.keywords.words.push(elem.keyword);
                            }
                        });

                        _queryEuropeana();
                    } else {
                        _showAlertDialog('Entity Service');
                    }
                });
            } else {
                _queryEuropeana();
            }
        };

        // Watch for keyword changes to highlight the current keywords
        $scope.$watch('keywords.words', function () {
            HighlightService.removeHighlight($scope.id);
            angular.forEach($scope.keywords.words, function (keyword) {
                HighlightService.highlight($scope.id, keyword);
            });
            $scope.newKeywords = true;
        }, true);

        // Show a dialog with all found results
        $scope.showResults = function (event, selectedTab) {
            $mdDialog.show({
                templateUrl: $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/content/result-dialog/result-dialog.html'),
                controller: 'ResultDialogCtrl',
                resolve: {
                    results: function () {
                        return queryResults;
                    },
                    selectedTab: function () {
                        return selectedTab;
                    },
                    resultNumbers: function () {
                        return $scope.resultNumbers;
                    }
                },
                targetEvent: event
            });
        };

        // checks if the given keyword is already in the list. if yes it removes it. if now it adds it
        $scope.toggleKeyword = function (keyword) {
            var index = $scope.keywords.words.indexOf(keyword);

            if (index === -1) {
                $scope.keywords.words.push(keyword);
            } else {
                $scope.keywords.words.splice(index, 1);
            }
            $scope.$apply();
        };

        function _queryEuropeana() {
            MessageService.callBG({
                method: {service: 'EuService', func: 'query'},
                data: $scope.keywords.words
            }, function (result) {
                if (result.type === 'success') {
                    queryResults = result.data.items;
                    $scope.resultNumbers = {};
                    $scope.resultNumbers.textResults = 0;
                    $scope.resultNumbers.imageResults = 0;
                    $scope.resultNumbers.avResults = 0;

                    angular.forEach(queryResults, function (item) {
                        if (item.type === 'TEXT') {
                            $scope.resultNumbers.textResults++;
                        } else if (item.type === 'IMAGE' || item.type === '3D') {
                            $scope.resultNumbers.imageResults++;
                        } else {
                            $scope.resultNumbers.avResults++;
                        }
                    });

                    $scope.queried = true;
                    $scope.newKeywords = false;
                    $scope.$apply();
                } else {
                    _showAlertDialog('Europeana Service');
                }
            });
        }

        function _showAlertDialog(errorSource) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('An unexpected error occured')
                    .content('We are sorry to inform you that an error occured at the ' + errorSource + '. Please try again or wait a few minutes.')
                    .ariaLabel('Error Dialog')
                    .ok('Ok')
            );
        }
    }

    angular
        .module('Jarvis')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
