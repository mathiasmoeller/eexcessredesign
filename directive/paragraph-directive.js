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
            template: '<div ng-controller="ParagraphCtrl">' +
            '<div  class="detectedParagraph" ng-transclude="true" ng-mouseenter="showButton = true" ng-mouseleave="showButton = false"></div>' +
            '<md-button aria-label="Query" class="md-primary md-raised queryButton" ng-show="showButton" ng-mouseenter="showButton = true" ng-mouseleave="showButton = false" ng-click="query()">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24h-24z" fill="none"/><path d="M20 19.59v-11.59l-6-6h-8c-1.1 0-1.99.9-1.99 2l-.01 16c0 1.1.89 2 1.99 2h12.01c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75l3.83 3.84zm-11-6.59c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"/></svg>' +
            '</md-button></div>',
            controller: 'ParagraphCtrl'
        };
    }

    angular
        .module('eRedesign')
        .directive('paragraphDirective', ParagraphDirective);

})();
