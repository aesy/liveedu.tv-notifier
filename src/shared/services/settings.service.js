angular
	.module("app")
	.service("settingsService", settingsService);

settingsService.$inject = ["$q", "lodash", "browserService", "livecodingService"];

function settingsService($q, _, browser, livecoding) {
    var storage_key = "LiveCoding.tv-Notifier_settings",
        settings = {},
        defaults = {
            pollFrequency: 60,
            browserSync: true,
            showBadge: true,
            soundClip: {
                selected: { label: "Soft1", value: "snd/soft1.wav"},
                options: [
                    {label: "Disabled", value: ""},
                    {label: "Soft1", value: "snd/soft1.wav"},
                    {label: "Soft2", value: "snd/soft2.wav"},
                    {label: "Soft3", value: "snd/soft3.wav"},
                    {label: "Soft4", value: "snd/soft4.wav"}
                ]
            },
            showNotification: true,
            follows: {
                ignore: [],
                names: []
            }
        };

    return {
        get: get,
        set: set,
        addFollows: addFollows,
        removeFollows: removeFollows,
        promise: sync()
    };

    function get() {
        return _.cloneDeep(_.defaultsDeep(settings, defaults));
    }

    function set(data) {
        settings = data;
        saveChanges();
    }

    function addFollows(usernames) {
        usernames.forEach(function(username) {
            _.pull(settings.follows.ignore, username);
            settings.follows.names.push(username);
        });

        saveChanges();
    }

    function removeFollows(usernames) {
        usernames.forEach(function(username) {
            _.pull(settings.follows.names, username);
            settings.follows.ignore.push(username);
        });

        saveChanges();
    }

    function saveChanges() {
        browser.storage.sync.set(storage_key, settings);
    }

    function sync() {
        var deferred = $q.defer();

        browser.storage.sync.get(storage_key).then(function(data) {
            settings = data || {};
        });

        livecoding.getFollowing().then(function(data) {
            var follows = data.map(function(value) {
                return value.username;
            }).filter(function(name) {
                return !_.contains(get().follows.ignore, name)
            });

            addFollows(_.difference(follows, get().follows.names));
            deferred.resolve();
        });

        return deferred.promise;
    }
}