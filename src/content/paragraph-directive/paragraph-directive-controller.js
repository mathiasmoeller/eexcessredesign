(function () {
    'use strict';

    function ParagraphCtrl($scope, $sce, $mdDialog, HighlightService, MessageService, Utils) {
        var _extID = Utils.getExtID();
        $scope.icons = {};
        $scope.icons.query = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/query-icon.svg');
        $scope.icons.search = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/search-icon.svg');
        $scope.icons.play = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/play-icon.svg');
        $scope.icons.image = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/image-icon.svg');
        $scope.icons.text = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/text-icon.svg');
        $scope.icons.video = $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/media/icons/video-icon.svg');

        // Must be a deep object to prevent problems with the watcher
        $scope.keywords = {};
        $scope.keywords.words = [];

        var queryResults = undefined;

        // Load the initial value from the storage
        chrome.storage.sync.get('Jarvis', function (data) {
            if (data.Jarvis) {
                MessageService.callBG({
                    method: {service: 'UtilsService', func: 'getCurrentTabID'}
                }, function (tabID) {

                    if (data.Jarvis[tabID] !== undefined) {
                        $scope.showPlugin = data.Jarvis[tabID];
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

                    if (storageValue[tabID] !== undefined) {
                        $scope.showPlugin = storageValue[tabID];
                    }
                    $scope.$apply();
                });
            }
        });

        // Searches for keywords and sends a query to europeana afterwards
        $scope.findKeywords = function () {
            // outgoing paragraph has to be in a list. this is requested by the api of the REST service
            var paragraph = [ER.paragraphs.getParagraph($scope.id)];

            MessageService.callBG({
                method: {service: 'KeywordService', func: 'getParagraphEntities'},
                data: paragraph
            }, function (result) {
                angular.forEach(result, function (elem) {
                    if ($scope.keywords.words.indexOf(elem) === -1) {
                        $scope.keywords.words.push(elem.keyword);
                    }
                });

                _queryEuropeana();
            });
        };

        // Sends a query with the given keywords to europeana
        $scope.query = function () {
            _queryEuropeana();
        };

        // Watch for keyword changes to highlight the current keywords
        $scope.$watch('keywords.words', function () {
            HighlightService.removeHighlight($scope.id);
            angular.forEach($scope.keywords.words, function (keyword) {
                HighlightService.highlight($scope.id, keyword);
            });
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
            console.log(keyword);
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
                queryResults = result.items;
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
                $scope.$apply();
            });
        }
    }

    angular
        .module('Jarvis')
        .controller('ParagraphCtrl', ParagraphCtrl);
})();
