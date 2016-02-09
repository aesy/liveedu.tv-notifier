angular
	.module("app")
	.service("settingsService", settingsService);

settingsService.$inject = ["$q", "lodash", "browserService", "livecodingService"];

function settingsService($q, _, browser, livecoding) {
    var storageKey = "LiveCoding.tv-Notifier_settings",
        onChangeCallbacks = [],
        settings = {},
        defaults = {
            browserSync: true, // TODO: implement
            follows: {
                ignore: [],
                names: []
            },
            polling: {
                frequencyMinutes: 5
            },
            badge: {
                show: true,
                removeOnPopup: false
            },
            notification: {
                show: true,
                soundClip: {
                    selected: {label: "Soft1", value: "snd/soft1.wav"},
                    options: [
                        {label: "Disabled", value: ""},
                        {label: "Soft1", value: "snd/soft1.wav"},
                        {label: "Soft2", value: "snd/soft2.wav"},
                        {label: "Soft3", value: "snd/soft3.wav"},
                        {label: "Soft4", value: "snd/soft4.wav"}
                    ]
                }
            }
        };

    /**
     * Listen for storage changes and make sure settings variable reflects it
     */
    browser.storage.sync.onChange(storageKey, function() {
        sync().then(fireOnChange);
    });

    return {
        get: get,
        set: set,
        clear: clear,
        addFollows: addFollows,
        removeFollows: removeFollows,
        onChange: onChange,
        promise: sync() // Used in routes file, not to be used anywhere else.
    };

    /**
     * Get settings
     * @return object - see structure of defaults variable
     */
    function get() {
        return _.cloneDeep(_.defaultsDeep(settings, defaults));
    }

    /**
     * Set storage data
     * @param data (object) Does not need to contain all possible properties,
     *                      however all data not provided will be set to defaults
     * @return undefined
     */
    function set(data) {
        settings = data;
        saveChanges();
    }

    /**
     * Clear storage
     * @return undefined
     */
    function clear() {
        browser.storage.sync.clear(storageKey);
    }

    /**
     * Add user(s) to follow
     * @param usernames (string or array of strings)
     * @return undefined;
     */
    function addFollows(usernames) {
        [].concat(usernames).forEach(function(username) {
            _.pull(settings.follows.ignore, username);
            settings.follows.names.push(username);
        });

        saveChanges();
    }

    /**
     * Stop following user(s)
     * @param usernames (string or array of strings)
     * @return undefined;
     */
    function removeFollows(usernames) {
        [].concat(usernames).forEach(function(username) {
            _.pull(settings.follows.names, username);
            settings.follows.ignore.push(username);
        });

        saveChanges();
    }

    /**
     * Make sure user names are lowercase as the livecoding API sometimes doesn't preserve
     * capitalization, leading to comparison errors.
     * @return undefined
     */
    function lowerCaseFollows() {
        var newNames = settings.follows.names.map(function(value) {
            return value.toLowerCase();
        });

        var newIgnore = settings.follows.ignore.map(function(value) {
            return value.toLowerCase();
        });

        settings.follows.names = _.union(newNames);
        settings.follows.ignore = _.union(newIgnore);
    }

    /**
     * Add settings change listener
     * @param callback (function)
     * @return undefined
     */
    function onChange(callback) {
        onChangeCallbacks.push(callback);
    }

    /**
     * Call listener callbacks
     * @return undefined
     */
    function fireOnChange() {
        onChangeCallbacks.forEach(function(func) {
            func();
        });
    }

    /**
     * Save changes to storage
     * @return undefined
     */
    function saveChanges() {
        /**
         * This line fixes a very peculiar bug which you can read about here:
         * https://stackoverflow.com/questions/35047242/object-property-becomes-null-after-chrome-storage-sync-set
         */
        settings = JSON.parse(JSON.stringify(settings));

        // Bug fix for v0.9.7
        lowerCaseFollows();

        browser.storage.sync.set(storageKey, settings);
    }

    /**
     * Make sure service has latest settings
     * @return Promise
     */
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
                    return value.username.toLowerCase();
                }).filter(function(name) {
                    return !_.includes(oldFollows.ignore, name);
                });

                addFollows(_.difference(newFollows, oldFollows.names));
                deferred.resolve();
            });
        });

        return deferred.promise;
    }
}