(function () {
    'use strict';

    function ParagraphDirective($sce) {

        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                id: '='
            },
            templateUrl: $sce.trustAsResourceUrl('chrome-extension://' + ER.utils.extID + '/content/paragraph-directive/paragraph-directive.html'),
            controller: 'ParagraphCtrl'
        };
    }

    angular
        .module('Jarvis')
        .directive('paragraphDirective', ParagraphDirective);

})();
