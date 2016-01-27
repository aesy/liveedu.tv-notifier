angular
	.module("app")
	.service("chromeService", chromeService);

chromeService.$inject = ["$q"];

function chromeService($q) {

    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason == "install") {
            openTab(getExtensionURL() + "message.html?install");
        } else if (details.reason == "update") {
            openTab(getExtensionURL() + "message.html?update");
        }
    });

    var storage = {
        sync: {
            get: function(key) {
                var deferred = $q.defer();

                chrome.storage.sync.get(key, function(data) {
                    deferred.resolve(data[key]);
                });

                return deferred.promise;
            },

            set: function(key, data) {
                var deferred = $q.defer();
                var obj = {};
                obj[key] = data;

                chrome.storage.sync.set(obj, function() {
                    deferred.resolve();
                });

                return deferred.promise;
            }
        },

        local: {
            get: function(key) {
                var deferred = $q.defer();
                var data = localStorage.getItem(key);

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = null;
                    console.warn("chromeService: couldn't parse localStorage[%s]", key);
                }

                deferred.resolve(data);

                return deferred.promise;
            },

            set: function(key, data) {
                localStorage.setItem(key, JSON.stringify(data));

                return $q.when(true);
            },

            clear: function(key) {
                localStorage.clear(key);
            }
        }
    };

    return {
        openTab: openTab,
        openWindow: openWindow,
        goToPage: goToPage,
        setBadge: setBadge,
        getBadge: getBadge,
        storage: storage,
        getExtensionURL: getExtensionURL,
        bindNotificationClicked: bindNotificationClicked,
        createNotification: createNotification,
        removeNotification: removeNotification,
        refresh: function() {
            location.reload();
        }
    };

    function openTab(url) {
        chrome.tabs.create({
            url: url
        });
    }

    function openWindow(url) {
        chrome.windows.create({
            url: url
        });
    }

    function goToPage(url) {
        window.location = url;
    }

    function setBadge(text, color) {
        var default_color = [255, 0, 0, 255];

        chrome.browserAction.setBadgeBackgroundColor({
            color: color || default_color
        });

        chrome.browserAction.setBadgeText({
            text: "" + text
        });
    }

    function getBadge() {
        var deferred = $q.defer();

        chrome.browserAction.getBadgeText({}, function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    }

    function getExtensionURL() {
        return chrome.extension.getURL("/");
    }

    function createNotification(id, data) {
        chrome.notifications.create(
            "" + id,
            data,
            function(id) {} // callback
        );
    }

    function removeNotification(id) {
        chrome.notifications.clear(
            "" + id,
            function(id) {} // callback
        );
    }

    function bindNotificationClicked(func) {
        // chrome.notifications.onButtonClicked.addListener(clicked);
         chrome.notifications.onClicked.addListener(func);
    }
}
