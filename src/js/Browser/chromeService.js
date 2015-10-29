app.service("chromeService", ["$q", function ($q) {
    this.openTab = function(url) {
        chrome.tabs.create({
            url: url
        });
    };

    this.setBadge = function(number) {
        var color = [255, 0, 0, 255];

        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });

        chrome.browserAction.setBadgeText({
            text: number > 0 ? '' + number : ''
        });
    };

    this.getBadge = function() {
        var deferred = $q.defer();

        chrome.browserAction.getBadgeText({}, function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    };

    this.store = function(data, sync) {
        var deferred = $q.defer();

        if (sync) {
            chrome.storage.sync.set(data, function() {
                deferred.resolve();
            });
        } else {
            // Local Storage
        }

        return deferred.promise;
    };

    this.storage = function(name, sync) {
        var deferred = $q.defer();

        if (sync) {
            chrome.storage.sync.get(name, function (data) {
                deferred.resolve(data[name]);
            });
        } else {
            // Local Storage
        }

        return deferred.promise;
    };

    this.bindNotificationClicked = function(func) {
        // chrome.notifications.onButtonClicked.addListener(clicked);
         chrome.notifications.onClicked.addListener(func);
    };
}]);
