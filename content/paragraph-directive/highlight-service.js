(function () {

    function HighlightService() {

        var _highlight = function (nodeID, word) {
            $('#' + nodeID + " > div.highlightable").highlight(word);
        };

        var _removeHighlight = function (nodeID) {
            $('#' + nodeID + " > .highlightable").removeHighlight();
        };

        return {
            highlight: _highlight,
            removeHighlight: _removeHighlight
        };
    }

    angular
        .module('Jarvis')
        .factory('HighlightService', HighlightService);

})();