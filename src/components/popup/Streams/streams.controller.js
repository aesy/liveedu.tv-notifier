angular
    .module("app")
    .controller("streamCtrl", streamCtrl);

streamCtrl.$inject = ["$scope", "$routeParams", "lodash", "settingsService", "livecodingService", "browserService", "filterService"];

function streamCtrl($scope, $routeParams, _, settings, livecoding, browser, filter) {
    var vm = this;

    vm.collection = [];
    vm.currentPage = $routeParams.page;
    vm.filter = filter.matchStream;
    vm.searching = true;
    vm.settings = {};

    /**
     * Initialize
     * @return undefined
     */
    function init() {
        vm.refresh();

        if (!vm.settings.badge.persistent)
            browser.setBadge("");
    }

    /**
     * Update settings object
     * @return undefined
     */
    function updateSettings() {
        vm.settings = settings.get();
    }

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
     * @return undefined;
     */
    vm.refresh = function() {
        vm.searching = true;
        vm.collection = [];
        var promise;

        switch (vm.currentPage) {
            case "following":
                promise = livecoding.filteredLivestreams(livecoding.getAllLive(), vm.settings.follows.names);
                break;
            case "livestreams":
                promise = livecoding.getAllLive();
                break;
            case "videos":
                promise = livecoding.getAllVideos();
                break;
            case "scheduled":
                promise = livecoding.getAllScheduled();
                break;
        }

        promise.then(function(streams) {
            vm.collection = streams;
            vm.searching = false;
        })
    };

    vm.toggleReminder = function(stream) {
        if (settings.willRemind(stream)) {
            settings.removeReminder(stream);
        } else {
            settings.addReminder({
                username: stream.username,
                timestamp: stream.timestamp,
                id: stream.id
            });
        }
    };

    vm.willRemind = settings.willRemind;


    /**
     * Listen for changes in settings
     */
    settings.on("change", updateSettings);
    settings.on("ready", function() {
        updateSettings();
        init();
    });

    $scope.$on("refreshStreams", vm.refresh);
    //$scope.$on("$routeChangeSuccess", vm.refresh);
}