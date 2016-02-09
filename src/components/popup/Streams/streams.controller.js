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

    /**
     * Open livecoding.tv stream chat window
     * @param name (string) username of streamer
     * @return undefined
     */
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

    /**
     * Open url in new tab
     * @read documentation of browserService.openTab
     */
    vm.openLink = browser.openTab;

    /**
     * Toggle whether user follows user
     * @param name (string) streamer username
     * @return undefined;
     */
    vm.toggleFavorite = function(name) {
        if (_.includes(vm.settings.follows.names, name)) {
            settings.removeFollows([name]);
        } else {
            settings.addFollows([name]);
        }
    };

    /**
     * Get method for sorting streams based on current page
     * @param stream (liveCodingStream)
     * @read liveCodingStream documentation in livecodingService
     * @return string | int
     */
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

    /**
     * Check if username is followed
     * @param name streamers username
     * @return boolean
     */
    vm.isFavorite = function(name) {
        return _.includes(vm.settings.follows.names, name);
    };

    /**
     * Refresh collection of livestreams
     */
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

    // TODO: implement
    //vm.remindMe = function(username) {
    //
    //};

    // TODO: implement
    //vm.willRemind = function(username) {
    //
    //};


    $scope.$on("refreshStreams", vm.refresh);
    $scope.$on("$routeChangeSuccess", vm.refresh);

    browser.setBadge(""); // remove badge when popup opened, TODO: implement use of vm.settings.badge.removeOnPopup
}