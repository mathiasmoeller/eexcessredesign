(function () {

    'use strict';

    function EuService($http, ENV) {
        var resultNumber = 30;
        var reusability = '';

        // load settings from storage
        chrome.storage.sync.get('JarvisSettings', function(data) {
            if (data && data.JarvisSettings) {
                reusability = _parseUsability(data.JarvisSettings.onlyOpen);
                resultNumber = data.JarvisSettings.resultNumber;
            }
        });


        var _buildQueryTerm = function (terms) {
            var queryTerm = '';
            angular.forEach(terms, function (value) {
                if (queryTerm === '') {
                    queryTerm = _wrapTerm(value);
                } else {
                    queryTerm = queryTerm.concat(' OR ' + _wrapTerm(value));
                }
            });
            return queryTerm;
        };

        var _wrapTerm = function(term) {
            return '(' + term + ')';
        };

        var _query = function (tabID, queryTerms) {

            var query = _buildQueryTerm(queryTerms);
            $http.get(ENV.api, {
                params: {
                    query: query,
                    rows: resultNumber,
                    reusability: reusability
                }
            })
                .success(function (result) {
                    return result;
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
            if (changes.JarvisSettings) {
                var change = changes.JarvisSettings.newValue;
                resultNumber = change.resultNumber;
                reusability = _parseUsability(change.onlyOpen);
            }
        });

        return {
            query: _query
        };
    }

    angular
        .module('JarvisBG')
        .factory('EuService', EuService);

})();
