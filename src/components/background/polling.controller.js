angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["$interval", "livecodingService", "settingsService", "browserService", "notificationFactory", "lodash"];

function pollingCtrl($interval, livecoding, settings, browser, Notification, _) {
    var opts = settings.get(),
        seen = [];

    /*
    Future structure for objects in 'seen':
    {
        username: username,
        lastSeen: timestamp,
    }
    */

    poll();

    $interval(function() {
        settings.getAsync().then(function(data) {
            opts = data;
            poll();
        });
    }, opts.pollFrequency * 1000 * 60);

    function poll() {
        livecoding.getAllLive().then(function(livestreams) {
            var count = 0;

            livestreams.forEach(function(stream) {
                if (!_.includes(opts.follows.names, stream.username))
                    return;

                if (_.includes(seen, stream.username))
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
            });

            if (opts.showBadge && count)
                browser.setBadge(count);
            else
                browser.setBadge("");
        });
    }
}