angular
	.module("app")
	.service("settingsService", settingsService);

settingsService.$inject = ["$q", "lodash", "browserService", "livecodingService"];

function settingsService($q, _, browser, livecoding) {
    var storageKey = "LiveCoding.tv-Notifier_settings",
        settings = {},
        defaults = {
            pollFrequency: 5,
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
        getAsync: getAsync,
        set: set,
        addFollows: addFollows,
        removeFollows: removeFollows,
        promise: sync()
    };

    function get() {
        return _.cloneDeep(_.defaultsDeep(settings, defaults));
    }

    function getAsync() {
        var deferred = $q.defer();

        browser.storage.sync.get(storageKey).then(function(data) {
            settings = data || {};
            deferred.resolve(get());
        });

        return deferred.promise;
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
        //console.log("pre-storage", settings);
        //var obj = {};
        //obj[storageKey] = settings;
        //chrome.storage.sync.set(obj, function() {
        //    setTimeout(function() {
        //        chrome.storage.sync.get(storageKey, function(data) {
        //            console.log("post-storage", data[storageKey]);
        //        });
        //    }, 3000);
        //});

        browser.storage.sync.set(storageKey, settings);
    }

    function sync() {
        var deferred = $q.defer();

        browser.storage.sync.get(storageKey).then(function(data) {
            settings = data || {};

            return livecoding.promise;
        }).then(function() {
            if (!livecoding.isAuthenticated()) {
                deferred.resolve();
                return;
            }

            livecoding.getFollowing().then(function(data) {
                var oldFollows = get().follows;
                var newFollows = data.map(function(value) {
                    return value.username;
                }).filter(function(name) {
                    return !_.includes(oldFollows.ignore, name)
                });

                addFollows(_.difference(newFollows, oldFollows.names));
                deferred.resolve();
            });
        });

        return deferred.promise;
    }
}