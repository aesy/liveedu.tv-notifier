var app = angular.module("app", [
    "ngRoute",
    "ngAnimate",
    "ngLodash",
    "ui.bootstrap"
]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: false
    //});

    $routeProvider
        .when('/settings', {
            templateUrl: 'js/Settings/settingsView.html',
            controller: 'settingsCtrl',
            controllerAs: 'settings'
        })

        .when('/:page', {
            templateUrl: 'js/Streams/streamsView.html',
            controller: 'streamCtrl',
            controllerAs: 'streams'
        })

        .otherwise({
            redirectTo: '/following'
        });
}]);