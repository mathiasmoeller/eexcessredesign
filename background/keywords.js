var ER = ER || {};

ER.keywords = (function() {
    var _getParagraphEntities = function(tabID, paragraphs, callback) {
        var xhr = $.ajax({
            url: 'http://mics.fim.uni-passau.de/serverREL/RELEVANTICO/api/entities',
            data: JSON.stringify({paragraphs: paragraphs}),
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });
        xhr.done(callback);
    };
    var _getParagraphEntityTypes = function(tabID, paragraphs, callback) {
        var xhr = $.ajax({
            url: 'http://zaire.dimis.fim.uni-passau.de:8999/doser-disambiguationserver/webclassify/entityAndCategoryStatistic',
            data: JSON.stringify({paragraphs: paragraphs}),
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });
        xhr.then(callback, function () {
            console.log("failed");
        });
    };

    return {
        getParagraphEntities: _getParagraphEntities,
        getParagraphEntityTypes: _getParagraphEntityTypes
    };
}());
