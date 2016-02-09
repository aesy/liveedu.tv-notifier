angular
    .module("app")
    .directive("terminal", terminal);

terminal.$inject = ["$timeout"];

/**
 * Terminal directive with simulated typing
 * @read: It makes use of angular-typer, see: https://github.com/httpete-ire/typer
 * @usage:
 *   <terminal username="myUser" output="myOutput"></terminal>
 *   output determines the text to be typed into the terminal. It is of the following format (each object is a paragraph):
 [{
   (optional string) preword - word to be prefixed to terminal immediatelly
   (array of strings) words - Terminal will simulate someone typing (or retyping if more than one string) the words in order of index
   (optional int) typeTime - Speed of simulated typing. Time for each character in milliseconds
   (optional int) delay - Time to wait before typing words of this object, in milliseconds
   (optional int) pause - Time to wait after completion, before proceeding to the next object, in milliseconds
 }, ...]
 */
function terminal($timeout) {
    return {
        restrict: "E",
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

            /**
             * Proceed to next object in output
             * @return undefined
             */
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