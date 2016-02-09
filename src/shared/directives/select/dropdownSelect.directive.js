angular
    .module("app")
    .directive("dropdownSelect", dropdownSelect);

dropdownSelect.$inject = ["$document"];

/**
 * Dropdown select directive, replacing <select>
 * @usage:
 *   <dropdown-select selected="selectedItem"
 *                    options="itemOptions"
 *                    property="label"
 *                    placeholder="myPlaceholderText"
 *                    change="onSelectionChange(value)">
 *   </dropdown-select>
 *
 *   `itemOptions` might look like this:
 *   [
 *     {label: "myLabel", value: "myValue"},
 *     {label: "myLabel2", value: "myValue2"}
 *   ]
 *   `selected` should be identical to one of these options.
 */
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

            /**
             * Select an item
             * @param item (object)
             * @return undefined
             */
            scope.select = function (item) {
                scope.selected = item;
                scope.showOptions = false;

                if (scope.change)
                    scope.change({value: item});
            };

            /**
             * Check if item is selected
             * @param item (object)
             * @return boolean
             */
            scope.isSelected = function (item) {
                if (!scope.selected || !item)
                    return;

                if (scope.property)
                    return item[scope.property] === scope.selected[scope.property];

                return item === scope.selected;
            };

            /**
             * Something is clicked, hide options
             * @return undefined
             */
            scope.clicked = function () {
                scope.showOptions = !scope.showOptions;
            };

            /**
             * User clicked on document, hide options if outside directive
             * @param event (Event)
             * @return undefined
             */
            function documentClick(event) {
                if (!elem[0].contains(event.target)) {
                    scope.$apply(function () {
                        scope.showOptions = false;
                    });
                }
            }

            $document.on("click", documentClick);

            scope.$on("$destroy", function () {
                $document.off("click", documentClick);
            });
        }
    };
}