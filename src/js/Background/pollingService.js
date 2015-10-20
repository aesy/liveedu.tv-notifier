app.service("pollingService", ["$interval", "streamService", "storageService", "chromeService", function ($interval, streams, storage, chrome) {
    var promise;

    function start() {
        stop();

        promise = $interval(function() {
            var favorites = storage.getFavorites();
            var seen = storage.getSeen();

            streams.getAllLive().then(function (streams) {
                var not_seen = Helpers.array.diff(streams, seen);
                var count = 0;

                for (var stream in not_seen) {
                    count++;

                    if (Helpers.array.contains(stream.username, favorites)) {
                        chrome.displayNotification({
                            title: stream.username + 's\' stream just went live!',
                            message: stream.tags + (stream.title ? ': ' + stream.title : '')
                        });
                    }
                }

                chrome.setBadge(count);
            });
        }, 3 * 1000);
    }

    function stop() {
        $interval.cancel(promise);
    }

    start();

    return {};
}]);
