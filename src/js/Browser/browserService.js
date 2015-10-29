app.service("browserService", ["chromeService", "firefoxService", function (chrome, firefox) {
    var browser = firefox;

    if (!!window.chrome)
        browser = chrome;

    return browser;
}]);
