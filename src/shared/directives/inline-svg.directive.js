angular
    .module("app")
    .directive("inlineSvg", inlineSvg);

inlineSvg.$inject = ["$http"];

function inlineSvg($http) {
    return {
        restrict: "EA",
        replace: true,
        transclude: false,
        scope: {
            src: "@"
        },
        link: function(scope, elem, attr) {
            function injectSvg(source) {
                return $http.get(source).success(function(data) {
                    var svg = angular.element(data);

                    if (!svg)
                        return;

                    elem.empty().append(svg);
                });
            }

            scope.$watch('src', function(newVal) {
                injectSvg(newVal);
            });

            injectSvg(scope.src);
        }
    };
}