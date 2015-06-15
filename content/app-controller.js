(function () {
    'use strict';

    function AppCtrl() {
    }

    angular
        .module('Jarvis')
        .controller('AppCtrl', AppCtrl)
        .run(function(ParagraphDetectionService) {
            ParagraphDetectionService.queryParagraphs();
        });
})();