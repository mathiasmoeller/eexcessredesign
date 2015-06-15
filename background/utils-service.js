(function () {

    'use strict';

    function UtilsService() {

        var _getCurrentTabID = function (tabID, data, callback) {
            callback({data: tabID, type: 'success'});
        };

        return {
            getCurrentTabID: _getCurrentTabID
        };
    }

    angular
        .module('JarvisBG')
        .factory('UtilsService', UtilsService);

})();
