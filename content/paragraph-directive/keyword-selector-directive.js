(function () {
    function KeywordSelector() {
        return {
            restrict: 'A',
            scope: {
                handleClick: '&',
                active: '='
            },
            link: function (scope, element) {
                scope.element = element;
                if (scope.active) {
                    element.css({cursor: 'pointer'});
                    element.on('dblclick', function (e) {
                        var range = window.getSelection() || document.getSelection() || document.selection.createRange();
                        var word = range.toString().trim();
                        if (word !== '') {
                            scope.handleClick({keyword: word});
                        }
                    });
                }
            }, controller: function ($scope) {
                $scope.$watch('active', function () {
                    if ($scope.active) {
                        _addProperties();
                    } else {
                        _removeProperties();
                    }
                });

                function _removeProperties() {
                    $scope.element.css({cursor: 'auto'});
                    $scope.element.off('dblclick');
                }

                function _addProperties() {
                    $scope.element.css({cursor: 'pointer'});
                    $scope.element.on('dblclick', function (e) {
                        var range = window.getSelection() || document.getSelection() || document.selection.createRange();
                        var word = range.toString().trim();
                        if (word !== '') {
                            $scope.handleClick({keyword: word});
                        }
                    });
                }
            }
        }
    }

    angular
        .module('Jarvis')
        .directive('keywordSelector', KeywordSelector)
})();