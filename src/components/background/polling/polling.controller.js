angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["$interval", "$filter", "lodash", "settingsService", "browserService", "notificationFactory", "pollingService"];

function pollingCtrl($interval, $filter, _, settings, browser, Notification, polling) {
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

        if (opts.follows.names || opts.reminders) {
            poll();
            promise = $interval(function() {
                poll();
            }, opts.polling.frequencyMinutes * 60000);
        }
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
        polling.getUnseenLiveStreams().then(function(livestreams) {
            var followedLivestreams = livestreams.filter(function(stream) {
                return _.includes(opts.follows.names, stream.username.toLowerCase());
            });

            var notFollowedLivestreams = livestreams.filter(function(stream) {
                return !_.includes(opts.follows.names, stream.username.toLowerCase());
            });

            remind(notFollowedLivestreams);
            updateBadge(followedLivestreams);

            if (opts.notification.show)
                notify(followedLivestreams, function(stream) {
                    return {
                        title: $filter("capitalize")(stream.username) + "s stream is live!",
                        message: stream.category + ": " + stream.title,
                        url: stream.url
                    };
                });
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
            var lastSeenFollowed = polling.getRecentlySeen().filter(function(username) {
                return _.includes(opts.follows.names, username.toLowerCase());
            });
            browser.setBadge(lastSeenFollowed.length || "");
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
        var currentTimestamp = Date.now(),
            liveResults = [],
            cancelled = [],
            removeAfter = opts.polling.dismissReminderAfterMinutes * 60,
            checkBefore = 15 * 60; // Totally arbitrary

        opts.reminders.forEach(function(reminder) {
            if (reminder.timestamp < currentTimestamp - removeAfter*1000 - opts.polling.frequencyMinutes*60000) {
                settings.removeReminder(reminder);
                cancelled.push(reminder);
                return;
            }

            livestreams.forEach(function(stream) {
                if (reminder.username.toLowerCase() !== stream.username.toLowerCase())
                    return;

                if (reminder.timestamp <= currentTimestamp + checkBefore*1000) {
                    settings.removeReminder(reminder);
                    liveResults.push(stream);
                }
            });
        });

        if (opts.notification.dismissedReminder)
            notify(cancelled, function(stream) {
                return {
                    title: $filter("capitalize")(stream.username) + "s scheduled stream notice",
                    message: $filter("humanReadableSeconds")((currentTimestamp - stream.timestamp) / 1000, false, "minute").toLowerCase()
                             + " has passed but " + stream.username + "s stream has yet to go live.",
                    url: stream.url
                };
            });

        notify(liveResults, function(stream) {
            return {
                title: $filter("capitalize")(stream.username) + "s scheduled stream is live!",
                message: stream.category + ": " + stream.title,
                url: stream.url
            };
        });
    }

    /**
     * Notify user of new unseen livestreams
     * @param livestreams (array of liveCodingStream objects)
     * @param messageCallback (function which returns object with title, message and url properties)
     * @return undefined
     */
    function notify(livestreams, messageCallback) {
        if (opts.notification.soundClip.selected.value && livestreams.length) {
            var audio = new Audio(opts.notification.soundClip.selected.value);
            audio.volume = opts.notification.soundClip.volume / 100;
            audio.play();
        }

        livestreams.forEach(function(stream) {
            var params = messageCallback(stream);
            params.persistent = opts.notification.persistent;

            new Notification(params).display();
        });
    }
}