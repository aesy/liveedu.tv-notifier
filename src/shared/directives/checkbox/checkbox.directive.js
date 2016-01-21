angular
    .module("app")
    .directive("checkbox", checkbox);

checkbox.$inject = [];

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
            scope.toggleClicked = function () {
                if (scope.isDisabled)
                    return;

                scope.isChecked = !(scope.isChecked);
                scope.toggle(elem, scope.isChecked);
            };
        }
    };
}