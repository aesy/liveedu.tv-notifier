angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["$interval", "settingsService", "browserService", "notificationFactory", "pollingService"];

function pollingCtrl($interval, settings, browser, Notification, polling) {
    var promise,
        opts;

    /**
     * Listen for changes in settings
     * Update local settings and restart poller on change
     */
    settings.on("change", updateSettings);
    settings.on("ready", updateSettings);

    /**
     * Update settings object
     * @return undefined
     */
    function updateSettings() {
        opts = settings.get();
        start();
    }

    /**
     * Start polling
     * Will cancel previous poll requests
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
            remind(polling.getRecentlySeen());
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
            browser.setBadge(polling.getRecentlySeen().length || "");
        } else {
            var currentBadge = parseInt(browser.getBadge()) || 0;
            browser.setBadge((currentBadge + livestreams.length) || "");
        }
    }

    /**
     * Notifies user of streams that user has requested to be reminded of
     * @param livestreams (array of liveCodingStream objects)
     * @return undefined
     */
    function remind(livestreams) {
        var reminders = livestreams.filter(function(stream) {
            for (var i in opts.reminders) {
                var reminder = opts.reminders[i];

                if (reminder.timestamp < new Date().getTime() - 60 * 60 * 1000) {
                    settings.removeReminder(reminder);
                } else if (reminder.username == stream.username && reminder.timestamp <= new Date().getTime()) {
                    settings.removeReminder(reminder);
                    return true;
                }
            }

            return false;
        });

        notify(reminders);
    }

    /**
     * Notify user of new unseen livestreams
     * @param livestreams (array of liveCodingStream objects)
     * @return undefined
     */
    function notify(livestreams) {
        if (opts.notification.soundClip.selected.value && livestreams.length) {
            var audio = new Audio(opts.notification.soundClip.selected.value);
            audio.volume = opts.notification.soundClip.volume / 100;
            audio.play();
        }

        if (opts.notification.show)
            livestreams.forEach(function(stream) {
                new Notification({
                    title: stream.username + 's stream is live!',
                    message: stream.category + ': ' + stream.title,
                    url: stream.url
                }).display();
            });
    }
}