angular
    .module("app")
    .directive("checkbox", checkbox);

checkbox.$inject = [];

/**
 * Checkbox directive, replacing <input type="checkbox">
 * @usage:
 *   <checkbox active="isActive"></checkbox>
 */
function checkbox() {
    return {
        restrict: 'E',
        replace: false,
        transclude: false,
        templateUrl: 'view/checkbox.html',
        scope: {
            'toggle': '&onToggle',
            'isChecked': '=active',
            'isDisabled': '=disabled'
        },
        link: function (scope, elem, attrs) {
            /**
             * Toggle active state
             * @return undefined
             */
            scope.toggleClicked = function () {
                if (scope.isDisabled)
                    return;

                scope.isChecked = !(scope.isChecked);
                scope.toggle(elem, scope.isChecked);
            };
        }
    };
}