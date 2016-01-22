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

    $routeProvider
        .when("/settings", {
            templateUrl: "view/settings.html",
            controller: "settingsCtrl",
            controllerAs: "settings"
        })

        .when("/popup.html", {
            redirectTo: "/following"
        })

        .when("/:page", {
            templateUrl: "view/streams.html",
            controller: "streamCtrl",
            controllerAs: "streams"
        });
}