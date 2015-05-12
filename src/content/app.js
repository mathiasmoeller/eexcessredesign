function MdThemeConfig ($mdThemingProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('red');
}

angular
    .module('Jarvis', [
        'ngAnimate',
        'ngMaterial'
    ]).config(MdThemeConfig);

$("html").attr('ng-app','Jarvis');