app.filter("alphanumerical", function() {
    return function(input) {
        return input.replace(/\W+/g, "");
    };
});