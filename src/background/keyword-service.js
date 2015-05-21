(function () {

    'use strict';

    function KeywordService($http) {

        var _getParagraphEntities = function (tabID, paragraphs, callback) {
            $http.post('http://zaire.dimis.fim.uni-passau.de:8999/doser-disambiguationserverstable/webclassify/entityAndCategoryStatistic', {
                paragraphs: paragraphs
            })
                .success(function (result) {
                    var scoredEntities = _calcEntityScores(result.paragraphs[0].statistic, 1);
                    console.log(scoredEntities);
                    callback(scoredEntities);
                }).error(function (error) {
                    console.log(error);
                });
        };

        // calcs a score based on the repetition of the entity and the type. returns all entities with a score higher than the given threshold
        // returns a list containing the entity, the score and a link to the entity
        var _calcEntityScores = function (entityList, threshold) {
            var weightedEntities = [];
            var score;
            angular.forEach(entityList, function (entity) {
                console.log(entity);

                // keyword service returns empty entity texts if they contain unknown symbols
                if (entity.key.text !== '') {
                    // the repetitions of the entity are weighted with 0.5
                    score = entity.value * 0.5;

                    // entities of type 'Person' and 'Location' are weighted with 1, the rest with 0.5
                    if (entity.key.type === 'Person' || entity.key.type === 'Location') {
                        score = score + 1;
                    } else {
                        score = score + 0.5;
                    }

                    if (score > threshold) {
                        weightedEntities.push({
                            keyword: entity.key.text,
                            score: score,
                            entityUri: entity.key.entityUri
                        });
                    }

                    score = 0;
                }
            });

            return weightedEntities;
        };

        return {
            getParagraphEntities: _getParagraphEntities
        };
    }

    angular
        .module('JarvisBG')
        .factory('KeywordService', KeywordService);

})();
