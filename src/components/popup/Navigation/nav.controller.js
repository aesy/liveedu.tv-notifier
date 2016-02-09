angular
    .module("app")
    .controller("navCtrl", navCtrl);

navCtrl.$inject = ["$rootScope", "$location", "livecodingService"];

function navCtrl($rootScope, $location, livecoding) {
    var vm = this;

    vm.isAuthenticated = livecoding.isAuthenticated;

    /**
     * Request list of streams to be refreshed
     * @return undefined
     */
    vm.refresh = function () {
        $rootScope.$broadcast("refreshStreams");
    };

    /**
     * Login to livecoding.tv
     * @return undefined
     */
    vm.login = function () {
        livecoding.authenticate();
    };

    /**
     * Logout
     * @return undefined
     */
    vm.logout = function() {
        livecoding.revokeToken();

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