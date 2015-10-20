app.filter('capitalize', function () {
    return function (input) {
        if (!input)
            return;

        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});