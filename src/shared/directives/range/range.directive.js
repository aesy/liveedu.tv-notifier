angular
    .module("app")
    .directive("range", range);

/**
 * Range directive, replacing <input type="range">
 * @usage:
 *   <range value="myValue" min="1" max="60" step="1" />
 */
function range() {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: "view/range.html",
        scope: {
            min: "=",
            max: "=",
            step: "=",
            value: "="
        },
        link: function (scope, elem, attrs) {
        }
    };
}