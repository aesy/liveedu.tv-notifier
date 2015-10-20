app.service("chromeService", ["$q", "notificationService", "storageService", function ($q, notification, storage) {
    this.open = function(url) {
        chrome.tabs.create({
            url: url
        });
    };

    this.displayNotification = function(data) {
        notification.create({
            title: data.title,
            message: data.message
        }).display();
    };

    this.setBadge = function(number) {
        var color = [255, 0, 0, 255];

        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });

        chrome.browserAction.setBadgeText({
            text: number ? '' + number : ''
        });
    };

    this.getBadge = function() {
        var deferred = $q.defer();

        chrome.browserAction.getBadgeText({}, function(data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    };

    this.storage = storage;
}]);
