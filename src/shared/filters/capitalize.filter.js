angular
    .module("app")
    .filter("capitalize", capitalize);

capitalize.$inject = [];

function capitalize() {
    return function (input) {
        if (!input)
            return;

        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
}