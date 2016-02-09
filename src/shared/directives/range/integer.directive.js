angular
    .module("app")
    .directive("integer", integer);

/**
 * Force ng-model to be integer
 * @usage:
 *   <input integer type="range">
 */
function integer() {
    return {
        require: 'ngModel',
        link: function (scope, ele, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                return parseInt(viewValue, 10);
            });
        }
    };
}