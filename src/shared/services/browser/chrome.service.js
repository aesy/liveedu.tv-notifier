angular
	.module("app")
	.service("chromeService", chromeService);

chromeService.$inject = ["$q", "lodash"];

function chromeService($q, _) {

    var storage = {
        sync: {
            get: function(key) {
                var deferred = $q.defer();

                chrome.storage.sync.get(key, function(data) {
                    deferred.resolve(data[key]);
                });

                return deferred.promise;
            },

            set: function(key, newData, merge) {
                var deferred = $q.defer();
                var data = {};

                storage.sync.get(key).then(function(oldData) {
                    if (merge) {
                        data[key] = _.defaultsDeep(newData, oldData);
                    } else {
                        data[key] = newData;
                    }

                    chrome.storage.sync.set(data, function() {
                        deferred.resolve();
                    });
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

            set: function(key, newData, merge) {
                var deferred = $q.defer();
                var data = newData;

                storage.local.get(key).then(function(oldData) {
                    if (merge) {
                        data = _.defaultsDeep(newData, oldData);
                    }

                    localStorage.setItem(key, JSON.stringify(data));
                    deferred.resolve();
                });

                return deferred.promise;
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
        getURL: getURL,
        bindNotificationClicked: bindNotificationClicked,
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

    function getURL() {
        return chrome.extension.getURL("/");
    }

    function bindNotificationClicked(func) {
        // chrome.notifications.onButtonClicked.addListener(clicked);
         chrome.notifications.onClicked.addListener(func);
    }
}
