angular
	.module("app")
	.service("settingsService", settingsService);

settingsService.$inject = ["$q", "lodash", "browserService"];

function settingsService($q, _, browser) {
    var storage_key = "LiveCoding.tv-Notifier_settings";

    var defaults = {
        pollFrequency: 60,
        browserSync: true,
        showBadge: true,
        soundClip: {
            value: "snd/soft1.wav"
        },
        showNotification: true
    };

    return {
        get: get,
        set: set
    };

    function get() {
        var deferred = $q.defer();

        browser.storage.sync.get(storage_key).then(function (data) {
            var settings = _.defaultsDeep(data || {}, defaults);

            deferred.resolve(settings);
        });

        return deferred.promise;
    }

    function set(data) {
        return browser.storage.sync.set(storage_key, data, false);
    }
}