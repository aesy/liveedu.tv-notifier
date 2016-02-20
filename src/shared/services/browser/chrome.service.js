angular
	.module("app")
	.service("chromeService", chromeService);

chromeService.$inject = ["$q", "lodash"];

function chromeService($q, _) {

    // TODO: Do this elsewhere.
    /**
     * Set up install/update listeners
     */
    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason == "install") {
            openTab(getBaseUrl() + "message.html?install");
        } else if (details.reason == "update") {
            chrome.storage.sync.remove("LiveCoding.tv-Notifier_settings", function() {}); // Reset settings
            //openTab(getBaseUrl() + "message.html?update");
        }
    });

    return {
        openTab: openTab,
        openWindow: openWindow,
        goToPage: goToPage,
        setBadge: setBadge,
        getBadge: getBadge,
        page: {
            getBaseUrl: getBaseUrl,
            getFullUrl: getFullUrl,
            refresh: refresh
        },
        storage: {
            sync: storage(true),
            local: storage(false)
        },
        notification: {
            bind: bindNotification,
            create: createNotification,
            remove: removeNotification
        }
    };

    /**
     * Get chrome storage wrapper object, for internal use
     * @param sync (boolean) determines use of browser sync
     * @read documentation inside function
     * @return object
     */
    function storage(sync) {
        var chromeStorage = chrome.storage[sync ? "sync" : "local"];

        return {
            /**
             * Get item from storage by key
             * @param key (string)
             * @return Promise with stored item
             */
            get: function(key) {
                var deferred = $q.defer();

                chromeStorage.get(key, function(data) {
                    deferred.resolve(data[key]);
                });

                return deferred.promise;
            },

            /**
             * Store item in storage by key
             * @param key (string)
             * @param data (any)
             * @return Promise
             */
            set: function(key, data) {
                var deferred = $q.defer();

                var obj = {};
                obj[key] = data;

                chromeStorage.set(obj, function() {
                    deferred.resolve();
                });

                return deferred.promise;
            },

            /***
             * Listen to changes in storage
             * @param keys (optional string | array of strings) if undefined/falsy, listener will fire on all changes
             * @param callback
             * @return undefined
             */
            onChange: (function() {
                var callbackKeys = {}, // callbacks for change in specific key
                    callbackAll = []; // callbacks for any change

                chrome.storage.onChanged.addListener(function(changes, namespace) {
                    if (namespace !== (sync ? "sync" : "local"))
                        return;

                    var changedKeys = _.intersection(Object.keys(callbackKeys), Object.keys(changes));

                    changedKeys.forEach(function(key) {
                        callbackKeys[key].forEach(function(callback) {
                            callback(changes[key]);
                        });
                    });

                    callbackAll.forEach(function(callback) {
                        callback(changes);
                    });
                });

                return function(keys, callback) {
                    if (!keys) {
                        callbackAll.push(callback);
                        return;
                    }

                    keys = [].concat(keys); // make sure it's an array

                    keys.forEach(function(key) {
                        if (!callbackKeys.hasOwnProperty(key))
                            callbackKeys[key] = [];

                        callbackKeys[key].push(callback);
                    });
                };
            })(),

            /**
             * Clear part or all of storage
             * @param keys (optional string | array of strings) if not provided, all of storage is cleared
             * @return Promise
             */
            clear: function(keys) {
                var deferred = $q.defer();

                if (!keys) {
                    chromeStorage.clear(function() {
                        deferred.resolve();
                    });
                } else {
                    chromeStorage.remove(keys, function() {
                        deferred.resolve();
                    });
                }

                return deferred.promise;
            }
        }
    }

    /**
     * Open tab
     * @param url (string)
     * @return undefined
     */
    function openTab(url) {
        window.open(url, "_blank");

        // Any reason to use `chrome.tabs.create` over `window.open` ?
        // Using `chrome.tabs.create` will cause chrome to tell the user that
        // the extension may access all of their browsing history. Wowza!!

        //chrome.tabs.create({
        //    url: url
        //});
    }

    /**
     * Open window
     * @param url (string)
     * @return undefined
     */
    function openWindow(url) {
        chrome.windows.create({
            url: url
        });
    }

    /**
     * Go to page
     * @param url (string)
     * @return undefined
     */
    function goToPage(url) {
        window.location = url;
    }

    /**
     * Set extension badge text
     * @param text (any) pass an empty string to remove badge
     * @param color (optional array[4] of integers) Each integer is a rgba value ranging 0-255
     * @return undefined
     */
    function setBadge(text, color) {
        //var default_color = [255, 0, 0, 255];

        if (color)
            chrome.browserAction.setBadgeBackgroundColor({
                color: color // || default_color
            });

        chrome.browserAction.setBadgeText({
            text: "" + text
        });
    }

    /**
     * Get badge text
     * @return Promise with string
     */
    function getBadge() {
        var deferred = $q.defer();

        chrome.browserAction.getBadgeText({}, function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    }

    /**
     * Create a notification
     * @param id (string) a unique id for this notification
     * @param data (NotificationOptions object)
     * @read https://developer.chrome.com/apps/notifications#type-NotificationOptions
     * @return Promise with id
     */
    function createNotification(id, data) {
        var deferred = $q.defer();

        chrome.notifications.create(
            id,
            data,
            function(id) {
                deferred.resolve(id);
            }
        );

        return deferred.promise
    }

    /**
     * Remove a notification by id
     * @param id (string)
     * @return Promise with id
     */
    function removeNotification(id) {
        var deferred = $q.defer();

        chrome.notifications.clear(
            id,
            function(id) {
                deferred.resolve(id);
            }
        );

        return deferred.promise
    }

    /**
     * Bind a notification event to a callback function
     * @param event (one of 'click', 'close', 'button click') determine what event to bind
     * @param callback (function)
     * @return undefined
     */
    function bindNotification(event, callback) {
        switch (event) {
            case 'click':
                chrome.notifications.onClicked.addListener(callback);
                break;
            case 'close':
                chrome.notifications.onClosed.addListener(callback);
                break;
            case 'button click':
                chrome.notifications.onButtonClicked.addListener(callback);
                break;
            default:
                throw Error("Invalid event");
        }
    }

    /**
     * Refresh current page
     * @return undefined
     */
    function refresh() {
        location.reload();
    }

    /**
     * Get base URL of current page
     * @return string
     */
    function getBaseUrl() {
        return window.location.origin;
    }

    /**
     * Get full URL or current page
     * @return string
     */
    function getFullUrl() {
        return window.location.href;
    }
}
