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
        .when("/popup.html", {
            redirectTo: "/following"
        })

        .when("/settings", {
            templateUrl: "view/settings.html",
            controller: "settingsCtrl",
            controllerAs: "settings",
            resolve: {
                settings: function(settingsService) {
                    return settingsService.promise;
                },
                livecoding: function(livecodingService) {
                    return livecodingService.promise;
                }
            }
        })

        .when("/background.html", {
            template: "",
            controller: "pollingCtrl",
            resolve: {
                settings: function(settingsService) {
                    return settingsService.promise;
                },
                livecoding: function(livecodingService) {
                    return livecodingService.promise;
                }
            }
        })

        .when("/:page", {
            templateUrl: "view/streams.html",
            controller: "streamCtrl",
            controllerAs: "streams",
            resolve: {
                settings: function(settingsService) {
                    return settingsService.promise;
                },
                livecoding: function(livecodingService) {
                    return livecodingService.promise;
                }
            }
        });
}