(function () {

    'use strict';

    function EuService($http, ENV) {
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
                    rows: 30
                }
            })
                .success(function (result) {
                    console.log(result);
                    callback(result);
                }).error(function (error) {
                    console.log(error);
                });
        };

        return {
            query: _query
        };
    }

    angular
        .module('eRedesignBG')
        .factory('EuService', EuService);

})();
