angular
    .module("app")
    .directive("range", range);

function range() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: 'view/range.html',
        scope: {
            min: '=',
            max: '=',
            step: '=',
            value: '='
        },
        link: function (scope, elem, attrs) {
        }
    };
}