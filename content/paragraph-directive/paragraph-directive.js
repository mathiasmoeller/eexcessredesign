(function () {
    'use strict';

    function ParagraphDirective($sce, Utils) {
        var _extID = Utils.getExtID();

        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: $sce.trustAsResourceUrl('chrome-extension://' + _extID + '/content/paragraph-directive/paragraph-directive.html'),
            controller: 'ParagraphCtrl'
        };
    }

    angular
        .module('Jarvis')
        .directive('paragraphDirective', ParagraphDirective);

})();
