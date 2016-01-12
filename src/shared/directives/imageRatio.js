angular
    .module("app")
    .directive("imageRatio", imageRatio);

imageRatio.$inject = [];

function imageRatio() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var ratio = scope.$eval(attrs.imageRatio).ratio;

            var width = element[0].clientWidth || element[0].parentElement.clientWidth;
            var height = Math.floor(width * ratio);

            element[0].style.width = width + "px";
            element[0].style.height = height + "px";
        }
    };
}