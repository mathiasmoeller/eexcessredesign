(function () {

    'use strict';

    function UtilsService() {

        var _getCurrentTabID = function (tabID, data, callback) {
            callback(tabID);
        };

        return {
            getCurrentTabID: _getCurrentTabID
        };
    }

    angular
        .module('eRedesignBG')
        .factory('UtilsService', UtilsService);

})();
