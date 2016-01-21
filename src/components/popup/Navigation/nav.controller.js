angular
    .module("app")
    .controller("navCtrl", navCtrl);

navCtrl.$inject = ["$rootScope", "$location", "livecodingService"];

function navCtrl($rootScope, $location, livecoding) {
    var vm = this;

    vm.refresh = function () {
        $rootScope.$broadcast("refreshStreams");
    };

    vm.login = function () {
        livecoding.authenticate();
    };

    vm.page = function (page) {
        if (page.lastIndexOf("/", 0) !== 0)
            page = "/" + page;

        return $location.path() === page;
    };
}