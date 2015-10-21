app.service("browserService", ["chromeService", "firefoxService", function (chrome, firefox) {
    var root = root || {};

    return chrome; // TEMPORARY

    //switch (typeof root.chrome) {
    //    case "undefined":
    //        return firefox;
    //    default:
    //        return chrome;
    //}
}]);
