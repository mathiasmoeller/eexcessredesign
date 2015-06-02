(function () {

    'use strict';

    function UtilsService() {

        var _getCurrentTabID = function (tabID) {
            return tabID;
        };

        return {
            getCurrentTabID: _getCurrentTabID
        };
    }

    angular
        .module('JarvisBG')
        .factory('UtilsService', UtilsService);

})();
