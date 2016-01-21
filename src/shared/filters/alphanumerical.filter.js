angular
    .module("app")
    .filter("alphanumerical", alphanumerical);

alphanumerical.$inject = [];

function alphanumerical() {
    return function(input) {
        if (!input)
            return;

        return input.replace(/\W+/g, "");
    };
}