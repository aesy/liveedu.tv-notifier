angular
    .module("app")
    .controller("streamCtrl", streamCtrl);

streamCtrl.$inject = ["$scope", "$routeParams", "lodash", "settingsService", "liveeduService", "browserService", "filterService"];

function streamCtrl($scope, $routeParams, _, settings, liveedu, browser, filter) {
    var vm = this;

    vm.collection = [];
    vm.currentPage = $routeParams.page;
    vm.filter = filter.matchStream;
    vm.searching = true;
    vm.settings = {};
	vm.error = null;

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
     * Open liveedu.tv stream chat window
     * @param name (string) username of streamer
     * @return undefined
     */
    vm.openChat = function(name) {
        var windowName     = "Chat: " + name;
        var windowFeatures = "resizable,width=320,height=480,dependent,dialog,minimizable," +
                             "scrollbars=no,menubar=no,toolbar=no,location=no,personalbar=no";
        var url            = "http://www.liveedu.tv/" + name + "/chat/";

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
     * @param stream (liveEduStream)
     * @read liveEduStream documentation in liveeduService
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
            case "livestreams":
                promise = liveedu.getAllLive();
                break;
            case "videos":
                promise = liveedu.getAllVideos();
                break;
            case "scheduled":
                promise = liveedu.getAllScheduled();
                break;
        }

        promise.then(function(streams) {
	        if (vm.currentPage === "following") {
		        streams = streams.filter(function(stream) {
			        return _.includes(vm.settings.follows.names, stream.username.toLowerCase());
		        });
	        }

            vm.collection = streams;
            vm.searching = false;
	        vm.error = null;
        }).catch(function(error) {
	        switch (error.status) {
		        case 401:
			        liveedu.revokeToken();
			        vm.error = "You do not seem to be logged in. Log in at liveedu.tv or log in from the sidebar " +
				        "to keep track of your follows.";
			        break;
		        default:
			        vm.error = "Could not connect to liveedu.tv (error code: " + (error.status || 0) + ")";
	        }

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