angular
    .module("app")
    .directive("dropdownSelect", dropdownSelect);

dropdownSelect.$inject = ["$document"];

function dropdownSelect($document) {
    return {
        replace: true,
        restrict: "E",
        templateUrl: "view/dropdownSelect.html",
        scope: {
            placeholder: "@",
            property: "@",
            options: "=",
            selected: "=",
            change: "&"
        },
        link: function (scope, elem, attr) {
            scope.showOptions = false;

            scope.select = function (item) {
                scope.selected = item;
                scope.showOptions = false;

                if (scope.change)
                    scope.change({value: item});
            };

            scope.isSelected = function (item) {
                if (!scope.selected || !item)
                    return;

                if (scope.property)
                    return item[scope.property] === scope.selected[scope.property];

                return item === scope.selected;
            };

            scope.clicked = function () {
                scope.showOptions = !scope.showOptions;
            };

            var clickOutside = function(event) {
                if (!elem[0].contains(event.target)) {
                    scope.$apply(function () {
                        scope.showOptions = false;
                    });
                }
            };

            $document.on("click", clickOutside);

            scope.$on("$destroy", function () {
                $document.off("click", clickOutside);
            });
        }
    };
}