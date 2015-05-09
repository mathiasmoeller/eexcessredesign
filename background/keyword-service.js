(function () {

    'use strict';

    function KeywordService($http) {

        var _getParagraphEntities = function (tabID, paragraphs, callback) {
            $http.post('http://mics.fim.uni-passau.de/serverREL/RELEVANTICO/api/entities', {
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
