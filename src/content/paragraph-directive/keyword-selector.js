(function () {
    function KeywordSelector() {
        return {
            restrict: 'A',
            scope: {
              handleClick: '&'
            },
            link: function(scope, element, attrs) {
                element.css({ cursor: 'pointer' });
                element.on('dblclick', function(e) {
                    var range = window.getSelection() || document.getSelection() || document.selection.createRange();
                    var word = range.toString().trim();
                    if(word !== '') {
                        scope.handleClick({keyword: word});
                    }
                    e.stopPropagation();
                });
            }
        }
    }

    angular
        .module('Jarvis')
        .directive('keywordSelector', KeywordSelector)
})();