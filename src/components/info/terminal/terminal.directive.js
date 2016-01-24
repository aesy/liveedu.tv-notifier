angular
    .module("app")
    .directive("terminal", terminal);

terminal.$inject = ["$timeout"];

function terminal($timeout) {
    return {
        restrict: "EA",
        replace: true,
        transclude: false,
        templateUrl: 'view/terminal.html',
        scope: {
            username: "=",
            output: "="
        },
        link: function(scope, elem, attr) {
            scope.maximized = false;
            scope.closed = false;
            scope.currentRow = -1;

            scope.nextRow = function() {
                var currentText = {};

                if (scope.currentRow >= 0 && scope.currentRow <= scope.output.length - 1)
                    currentText = scope.output[scope.currentRow];

                $timeout(function() {
                    scope.currentRow++;
                }, currentText.pause || 0);
            };

            scope.nextRow();
        }
    };
}