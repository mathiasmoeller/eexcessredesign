(function () {

    'use strict';

    function C4Service($http, ENV) {
        var resultNumber = 30;
        var language = [];

        // load settings from storage
        chrome.storage.sync.get('JarvisSettings', function(data) {
            if (data && data.JarvisSettings) {
                resultNumber = data.JarvisSettings.resultNumber;
                language = _parseLanguage(data.JarvisSettings.language);
            }
        });

        var _buildQueryTerm = function (terms) {
            var query = [];
            angular.forEach(terms, function (value) {
                    query.push({"text": value});
            });

            return query;
        };

        var _query = function (tabID, queryTerms, callback) {

            var query = _buildQueryTerm(queryTerms);
            $http.post(ENV.C4_API, {
                    contextKeywords: query,
                    numResults: resultNumber,
                    languages: language
            })
                .success(function (result) {
                    callback({data: result.result, type: 'success'});
                }).error(function (error) {
                    console.log(error);
                    callback({data: error, type: 'error'});
                });
        };

        var _parseLanguage = function (language) {
            if (language) {
                return [{"iso2": language}];
            } else {
                return [];
            }
        };

        chrome.storage.onChanged.addListener(function (changes) {
            if (changes.JarvisSettings) {
                var change = changes.JarvisSettings.newValue;
                resultNumber = change.resultNumber;
                language = _parseLanguage(change.language);
            }
        });

        return {
            query: _query
        };
    }

    angular
        .module('JarvisBG')
        .factory('C4Service', C4Service);

})();
