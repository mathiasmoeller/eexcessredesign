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

// we need to inject the angular app and controller attributes to bootstrap the application
$("html").attr('ng-app','Jarvis');
$("body").attr('ng-controller', 'AppCtrl');