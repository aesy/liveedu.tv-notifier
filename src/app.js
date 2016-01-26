angular.module("app", [
    "ngRoute",
    "ngAnimate",
    "ngLodash",
    "ui.bootstrap",
    "luegg.directives",
    "typer"
]);

angular
    .module("app")
    .config(config);

config.$inject = ["$routeProvider", "$locationProvider"];

function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    // Global resolve
    var originalWhen = $routeProvider.when;
    $routeProvider.when = function(path, route) {
        route.resolve || (route.resolve = {});
        angular.extend(route.resolve, {
            "1": function(settingsService) {
                return settingsService.promise;
            },
            "2": function(livecodingService) {
                return livecodingService.promise;
            }
        });

        return originalWhen.call($routeProvider, path, route);
    };

    $routeProvider
        .when("/settings", {
            templateUrl: "view/settings.html",
            controller: "settingsCtrl",
            controllerAs: "settings"
        })

        .when("/popup.html", {
            redirectTo: "/following"
        })

        .when("/background.html", {})

        .when("/:page", {
            templateUrl: "view/streams.html",
            controller: "streamCtrl",
            controllerAs: "streams"
        });
}