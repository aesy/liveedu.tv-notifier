angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["$interval", "livecodingService", "settingsService", "browserService", "lodash"];

function pollingCtrl($interval, livecoding, settings, browser, _) {
    var opts = settings.get(),
        seen = [],
        promise;

    start();

    return {};

    function start() {
        stop();
        poll();

        promise = $interval(function() {
            opts = settings.get();
            //poll();
        }, opts.pollFrequency * 1000);
    }

    function stop() {
        $interval.cancel(promise);
    }

    function poll() {
        livecoding.getAllLive().then(function(livestreams) {
            var count = 0;

            livestreams.forEach(function(stream) {
                if (!_.contains(opts.follows.names, stream.username))
                    return;

                if (_.contains(seen, stream.username))
                    return;
                else
                    seen.push(stream.username);

                if (count === 0 && opts.soundClip.selected.value)
                    new Audio(opts.soundClip.selected.value).play();

                if (opts.showNotification)
                    new Notification({
                        title: stream.username + 's stream just went live!',
                        message: stream.category + ': ' + stream.title,
                        url: stream.url
                    }).display();

                count++;

                if (opts.showBadge)
                    browser.getBadge().then(function (currentCount) {
                        browser.setBadge((parseInt(currentCount) || 0) + count);
                    });
            });
        });
    }
}