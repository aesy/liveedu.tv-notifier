app.controller("streamCtrl",
    ["$scope", "streamService", "$routeParams", "chromeService", "filterService", function($scope, streams, $routeParams, chrome, filter) {
    var vm = this;

    vm.collection = [];
    vm.favorites = [];

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

    vm.toggleFavorite = function(name) {
        if (Helpers.array.contains(name, vm.favorites)) {
            vm.favorites = Helpers.array.removeValue(vm.favorites, name);
        } else {
            vm.favorites.push(name);
        }

        chrome.storage.setFavorites(vm.favorites);
    };

    vm.isFavorite = function(name) {
        return Helpers.array.contains(name, vm.favorites);
    };

    vm.updateFavorites = function() {
        chrome.storage.getFavorites().then(function(data) {
            vm.favorites = Helpers.object.isEmpty(data) ? [] : data;
        });
    };

    vm.update = function() {
        switch ($routeParams.page) {
            case 'following':
                streams.getAllLive().then(function (streams) {
                    vm.collection = streams.filter(function(stream) {
                        return Helpers.array.contains(stream.username, vm.favorites, false);
                    });
                });
                break;
            case 'livestreams':
                streams.getAllLive().then(function(streams) {
                    vm.collection = streams;
                });
                break;
            case 'videos':
                streams.getAllVideos().then(function(streams) {
                    vm.collection = streams;
                });
                break;
            case 'scheduled':
                streams.getAllScheduled().then(function(streams) {
                    vm.collection = streams;
                });
                break;
        }
    };

    $scope.$on('refreshStreams', vm.update);
    $scope.$on('$routeChangeSuccess', vm.update);

    (function init() {
        //vm.updateFavorites();
    })();

}]);