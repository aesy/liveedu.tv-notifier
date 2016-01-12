angular
    .module("app")
    .controller("streamCtrl", streamCtrl);

streamCtrl.$inject = ["$scope", "streamService", "$routeParams", "lodash", "browserService", "filterService"];

function streamCtrl($scope, streams, $routeParams, _, browser, filter) {
    var vm = this;

    vm.collection = [];
    vm.favorites = [];
    vm.currentPage = $routeParams.page;
    vm.filter = filter.matchStream;

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

    vm.openLink = function(name) {
        browser.openTab("https://www.livecoding.tv/" + name + "/");
    };

    vm.toggleFavorite = function(name) {
        if (_.contains(vm.favorites, name)) {
            _.remove(vm.favorites, name);
        } else {
            vm.favorites.push(name);
        }

        //storage.setFavorites(vm.favorites);
    };

    vm.order = function(stream) {
        switch (vm.currentPage) {
            case "scheduled": // Sort by time left
                var timestamp = parseInt(stream.timestamp) || 0;
                return timestamp*1000 - Date.now();
            case "videos": // Don't sort
                return "";
            default: // Sort by views, descending
                return -stream.views;
        }
    };

    vm.isFavorite = function(name) {
        return _.contains(vm.favorites, name);
    };

    vm.updateFavorites = function(callback) {
        //storage.getFavorites().then(function(data) {
        //    vm.favorites = _.isEmpty(data) ? [] : data;
        //
        //    if (callback)
        //        callback();
        //});
    };

    vm.refresh = function() {
        switch (vm.currentPage) {
            case "following":
                streams.getAllLive().then(function (streams) {
                    vm.collection = streams.filter(function (stream) {
                        return _.contains(vm.favorites, stream.username);
                    });
                });
                break;
            case "livestreams":
                streams.getAllLive().then(function (streams) {
                    vm.collection = streams;
                });
                break;
            case "videos":
                streams.getAllVideos().then(function (streams) {
                    vm.collection = streams;
                });
                break;
            case "scheduled":
                streams.getAllScheduled().then(function (streams) {
                    vm.collection = streams;
                });
                break;
        }
    };

    vm.update = function() {
        vm.updateFavorites(function() {
            vm.refresh();
        });
    };

    vm.remindMe = function(username) {

    };

    vm.willRemind = function(username) {

    };

    $scope.$on("refreshStreams", vm.update);
    $scope.$on("$routeChangeSuccess", vm.update);

    browser.setBadge(""); // remove badge when popup opened
}