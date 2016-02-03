angular
    .module("app")
    .controller("streamCtrl", streamCtrl);

streamCtrl.$inject = ["$scope", "$routeParams", "lodash", "settingsService", "livecodingService", "browserService", "filterService"];

function streamCtrl($scope, $routeParams, _, settings, livecoding, browser, filter) {
    var vm = this;

    vm.collection = [];
    vm.settings = settings.get();
    vm.currentPage = $routeParams.page;
    vm.filter = filter.matchStream;
    vm.searching = false;

    vm.openChat = function(name) {
        var windowName     = "livecodingtv.chat." + name;
        var windowFeatures = "resizable,width=320,height=480,dependent,dialog,minimizable," +
                             "scrollbars=no,menubar=no,toolbar=no,location=no,personalbar=no";
        var url            = "http://www.livecoding.tv/chat/" + name + "/";

        var chatWindow = window.open(url, windowName, windowFeatures);

        if (chatWindow === null) {
            window.alert("Your browser may block the popup windows.");
        } else {
            chatWindow.focus();
        }
    };

    vm.openLink = function(url) {
        browser.openTab(url);
    };

    vm.toggleFavorite = function(name) {
        if (_.includes(vm.settings.follows.names, name)) {
            settings.removeFollows([name]);
        } else {
            settings.addFollows([name]);
        }

        vm.settings = settings.get();
    };

    vm.order = function(stream) {
        switch (vm.currentPage) {
            case "scheduled": // Sort by time left
                return "-" + (stream.timestamp || 0);
            case "videos": // Don't sort
                return "";
            default: // Sort by views, descending
                return -stream.views;
        }
    };

    vm.isFavorite = function(name) {
        return _.includes(vm.settings.follows.names, name);
    };

    vm.refresh = function() {
        vm.collection = [];
        vm.searching = true;

        switch (vm.currentPage) {
            case "following":
                livecoding.getAllLive().then(function (streams) {
                    vm.collection = streams.filter(function (stream) {
                        return vm.isFavorite(stream.username);
                    });
                    vm.searching = false;
                });
                break;
            case "livestreams":
                livecoding.getAllLive().then(function (streams) {
                    vm.collection = streams;
                    vm.searching = false;
                });
                break;
            case "videos":
                livecoding.getAllVideos().then(function (streams) {
                    vm.collection = streams;
                    vm.searching = false;
                });
                break;
            case "scheduled":
                livecoding.getAllScheduled().then(function (streams) {
                    vm.collection = streams;
                    vm.searching = false;
                });
                break;
            default:
                vm.searching = false;
        }
    };

    //vm.remindMe = function(username) {
    //
    //};

    //vm.willRemind = function(username) {
    //
    //};

    $scope.$on("refreshStreams", vm.refresh);
    $scope.$on("$routeChangeSuccess", vm.refresh);

    browser.setBadge(""); // remove badge when popup opened
}