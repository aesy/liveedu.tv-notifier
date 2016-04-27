angular
    .module("app")
    .directive("number", number);

function number() {
    return {
        require: "ngModel",
        link: function (scope, ele, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                return parseFloat(viewValue);
            });
        }
    };
}