angular
    .module("app")
    .filter("alphanumerical", alphanumerical);

alphanumerical.$inject = [];

function alphanumerical() {
    return function(input) {
        return input.replace(/\W+/g, "");
    };
}