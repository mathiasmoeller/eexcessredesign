(function () {

    'use strict';

    function MdThemeConfig ($mdThemingProvider, $mdIconProvider) {

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('red');


        $mdIconProvider
            .icon('query', 'media/icons/query-icon.svg');
    }


    angular
        .module('Jarvis')
        .config(MdThemeConfig);

})();
