angular
	.module("app")
	.service("settingsService", settingsService);

settingsService.$inject = ["$q", "lodash", "browserService", "livecodingService"];

function settingsService($q, _, browser, livecoding) {
    var storageKey = "LiveCoding.tv-Notifier_settings",
        callbacks = {},
        ready = false,
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
                persistent: true
            },
            notification: {
                show: true,
                soundClip: {
                    selected: {label: "Soft 1", value: "snd/soft1.mp3"},
                    options: [
                        {label: "Disabled", value: ""},
                        {label: "Altair", value: "snd/altair.mp3"},
                        {label: "Ariel", value: "snd/ariel.mp3"},
                        {label: "Beryllium", value: "snd/beryllium.mp3"},
                        {label: "Ceres", value: "snd/ceres.mp3"},
                        {label: "Chime", value: "snd/chime.mp3"},
                        {label: "Cyan Message", value: "snd/cyanmessage.mp3"},
                        {label: "Cyan Ping", value: "snd/cyanping.mp3"},
                        {label: "Deneb", value: "snd/deneb.mp3"},
                        {label: "Pixiedust", value: "snd/pixiedust.mp3"},
                        {label: "Pong", value: "snd/pong.mp3"},
                        {label: "Soft 1", value: "snd/soft1.mp3"},
                        {label: "Soft 2", value: "snd/soft2.mp3"},
                        {label: "Soft 3", value: "snd/soft3.mp3"},
                        {label: "Soft 4", value: "snd/soft4.mp3"},
                        {label: "TXP Online", value: "snd/txponline.mp3"}

                    ]
                }
            }
        };

    /**
     * Listen for storage changes and make sure settings variable reflects it
     */
    browser.storage.sync.onChange(storageKey, function() {
        sync().then(function() {
            fire("change");
        });
    });

    livecoding.on("ready", function() {
        sync().then(function() {
            fire("ready");
        });
    });

    return {
        get: get,
        set: set,
        clear: clear,
        addFollows: addFollows,
        removeFollows: removeFollows,
        on: on
    };

    /**
     * Get settings
     * Note: An empty object may be returned if this is called before the service syncs with storage.
     * @read function on
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
     * Add event listener
     * @param event (string one of ('ready', 'change'))
     * @param callback (function)
     * @return undefined
     */
    function on(event, callback) {
        switch (event) {
            case "ready":
            case "change":
                if (!callbacks.hasOwnProperty(event))
                    callbacks[event] = [];

                callbacks[event].push(callback);

                if (event === "ready" && ready)
                    callback();
                break;
            default:
                throw Error("Invalid event type");
        }
    }

    /**
     * Fire off listener callbacks
     * @param event (string one of ('ready', 'change'))
     * @return undefined
     */
    function fire(event) {
        if (event === "ready")
            ready = true;

        if (!callbacks.hasOwnProperty(event))
            return;

        callbacks[event].forEach(function(callback) {
            callback();
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

                var currentFollows = data.map(function(value) {
                    return value.username.toLowerCase();
                }).filter(function(name) {
                    return !_.includes(oldFollows.ignore, name);
                });

                var newFollows = _.difference(currentFollows, oldFollows.names);

                if (newFollows.length)
                    addFollows(newFollows);

                deferred.resolve();
            });
        });

        return deferred.promise;
    }
}