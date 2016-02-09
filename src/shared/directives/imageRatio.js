angular
    .module("app")
    .directive("imageRatio", imageRatio);

imageRatio.$inject = [];

/**
 * Resize image a appease a specific ratio (does NOT update on resize)
 * @usage:
 *   <img image-ratio="{ratio: 140/250}" src="needmore.jpg" />
 */
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