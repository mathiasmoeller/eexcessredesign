(function () {

    'use strict';

    function KeywordService($http) {

        var _getParagraphEntities = function (tabID, paragraphs, callback) {
            $http.post('http://zaire.dimis.fim.uni-passau.de:8999/doser-disambiguationserverstable/webclassify/entityAndCategoryStatistic', {
                paragraphs: paragraphs
            })
                .success(function (result) {
                    callback(result);
                }).error(function (error) {
                    console.log(error);
                });
        };

        return {
            getParagraphEntities: _getParagraphEntities
        };
    }

    angular
        .module('JarvisBG')
        .factory('KeywordService', KeywordService);

})();
