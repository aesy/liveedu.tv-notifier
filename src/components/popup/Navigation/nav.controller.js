angular
    .module("app")
    .controller("navCtrl", navCtrl);

navCtrl.$inject = ["$rootScope", "$location", "liveeduService"];

function navCtrl($rootScope, $location, liveedu) {
    var vm = this;

    vm.isAuthenticated = liveedu.isAuthenticated;

    /**
     * Request list of streams to be refreshed
     * @return undefined
     */
    vm.refresh = function () {
        $rootScope.$broadcast("refreshStreams");
    };

    /**
     * Login to liveedu.tv
     * @return undefined
     */
    vm.login = function () {
        liveedu.authenticate();
    };

    /**
     * Logout
     * @return undefined
     */
    vm.logout = function() {
        liveedu.revokeToken();

        // Remove favorites also ?
    };

    /**
     * Determine if input parameter is current page
     * @param page (string)
     * @return boolean
     */
    vm.page = function (page) {
        if (page.lastIndexOf("/", 0) !== 0)
            page = "/" + page;

        return $location.path() === page;
    };
}