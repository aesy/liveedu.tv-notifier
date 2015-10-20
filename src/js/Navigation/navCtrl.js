app.controller("navCtrl", ["$rootScope", "$location", function ($rootScope, $location) {
    var vm = this;

    vm.refresh = function () {
        $rootScope.$broadcast('refreshStreams');
    };

    vm.login = function () {
        //
    };

    vm.page = function (page) {
        if (page.lastIndexOf('/', 0) !== 0)
            page = '/' + page;

        return $location.path() == page;
    };
}]);