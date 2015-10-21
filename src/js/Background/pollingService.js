app.service("pollingService", ["$interval", "streamService", "storageService", "browserService", function ($interval, streams, storage, browser) {
    var promise;
    var seen = [];
    var settings = {};

    function start() {
        stop();

        promise = $interval(function() {
            var favorites = storage.getFavorites();

            streams.getAllLive().then(function (streams) {
                var not_seen = Helpers.array.diff(streams, seen);
                seen = streams;

                var count = 0;

                if (not_seen.length > 0 && settings.sound)
                    new Audio(settings.sound).play();

                for (var i in not_seen) {
                    var stream = not_seen[i];
                    count++;

                    if (Helpers.array.contains(stream.username, favorites)) {
                        browser.displayNotification({
                            title: stream.username + 's\' stream just went live!',
                            message: stream.tags + (stream.title ? ': ' + stream.title : '')
                        });
                    }
                }

                browser.getBadge().then(function(currentCount) {
                    browser.setBadge(currentCount + count);
                });
            });
        }, settings.pollingRate * 1000);
    }

    function stop() {
        $interval.cancel(promise);
    }

    storage.getSettings().then(function(data) {
        settings = data;

        start();
    });

    return {};
}]);
