angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["$interval", "settingsService", "browserService", "notificationFactory", "pollingService"];

function pollingCtrl($interval, settings, browser, Notification, polling) {
    var promise,
        opts = settings.get();

    /**
     * Listen for changes in settings
     * Update local settings and restart poller on change
     */
    settings.onChange(function() {
        opts = settings.get();
        start();
    });

    start();

    /**
     * Start polling
     * Will cancels previous poll requests if more than once
     * @return undefined
     */
    function start() {
        stop();
        poll();

        promise = $interval(function() {
            poll();
        }, opts.polling.frequencyMinutes * 60000);
    }

    /**
     * Cancel polling, if any
     * @return undefined
     */
    function stop() {
        $interval.cancel(promise);
    }

    /**
     * Poll LiveCoding for new streams
     * @return undefined
     */
    function poll() {
        polling.getUnseenLiveStreams(opts.follows.names).then(function(livestreams) {
            updateBadge(livestreams);
            notify(livestreams);
        });
    }

    /**
     * Update extension badge
     * @param livestreams (array of liveCodingStream objects)
     * @return undefined
     */
    function updateBadge(livestreams) {
        if (!opts.badge.show) {
            browser.setBadge("");
            return;
        }

        if (opts.badge.persistent) {
            browser.setBadge(livestreams.length || "");
        } else {
            browser.setBadge(polling.getRecentlySeen().length || "");
        }
    }

    /**
     * Notify user of new unseen livestreams
     * @param livestreams (array of liveCodingStream objects)
     * @return undefined
     */
    function notify(livestreams) {
        if (opts.notification.soundClip.selected.value && livestreams.length)
            new Audio(opts.notification.soundClip.selected.value).play();

        if (opts.notification.show)
            livestreams.forEach(function(stream) {
                new Notification({
                    title: stream.username + 's stream just went live!',
                    message: stream.category + ': ' + stream.title,
                    url: stream.url
                }).display();
            });
    }
}