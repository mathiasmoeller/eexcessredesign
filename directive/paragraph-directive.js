(function () {
    'use strict';

    function ParagraphDirective() {

        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            //scope: {
            //    configName: '=', // The processor config can contain more than one attribute. The configName contains the key of the current config attribute
            //    configDeclaration: '=', // The single configuration instance, e.g. 'foo: { $string: null, .. }' => { $string: null, .. }
            //    onedataModel: '=', // The according onedata node, that will be configured with this single configuration instance
            //    jointModel: '=' // The according joint cell with its backbone model to adapt changes on UI
            //},
            template: '<div ng-controller="ParagraphCtrl" style="border: 2px solid green;" ng-transclude="true"></div>',
            controller: 'ParagraphCtrl'
        };
    }

    angular
        .module('eRedesign')
        .directive('paragraphDirective', ParagraphDirective);

})();
