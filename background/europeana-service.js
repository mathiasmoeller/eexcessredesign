(function () {

    'use strict';

    function EuService($http, ENV) {
        var resultNumber = 30;
        var reusability = '';

        // load settings from storage
        chrome.storage.sync.get('eRedesignSettings', function(data) {
            if (data && data.eRedesignSettings) {
                reusability = _parseUsability(data.eRedesignSettings.onlyOpen);
                resultNumber = data.eRedesignSettings.resultNumber;
            }
        });


        var _buildQueryTerm = function (terms) {
            var queryTerm = '';
            angular.forEach(terms, function (value) {
                if (queryTerm === '') {
                    queryTerm = value;
                } else {
                    queryTerm = queryTerm.concat(' OR ' + value);
                }
            });
            return queryTerm;
        };

        var _query = function (tabID, queryTerms, callback) {

            var query = _buildQueryTerm(queryTerms);
            console.log("reaced EuService");

            $http.get(ENV.api, {
                params: {
                    query: query,
                    rows: resultNumber,
                    reusability: reusability
                }
            })
                .success(function (result) {
                    console.log(result);
                    callback(result);
                }).error(function (error) {
                    console.log(error);
                });
        };

        var _parseUsability = function (onlyOpen) {
            if (onlyOpen) {
                return 'open';
            } else {
                return '';
            }
        };

        chrome.storage.onChanged.addListener(function (changes) {
            if (changes.eRedesignSettings) {
                var change = changes.eRedesignSettings.newValue;
                resultNumber = change.resultNumber;
                reusability = _parseUsability(change.onlyOpen);
            }
        });

        return {
            query: _query
        };
    }

    angular
        .module('eRedesignBG')
        .factory('EuService', EuService);

})();
