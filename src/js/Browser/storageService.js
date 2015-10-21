app.service("storageService", ["$q", "browserService", function($q, browser) {

    this.getSettings = function() {
        var defaults = {
            sound: 'snd/Soft1.wav',
            pollingRate: 30
        };

        var settings = this.getByKey("settings");

        return Helpers.object.merge(defaults, settings);
    };

    this.setSettings = function(data) {
        return this.setByKey("settings", data, true);
    };

    this.getFavorites = function() {
        return this.getByKey("favorites");
    };

    this.setFavorites = function(data) {
        return this.setByKey("favorites", data, false);
    };

    this.getByKey = function(key) {
        var deferred = $q.defer();
        var name = "livecoding_" + key;

        browser.storage(name, true).then(function (data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    };

    this.setByKey = function(key, newData, merge) {
        var deferred = $q.defer();

        this.getByKey(key).then(function(oldData) {
            var data = {};
            var name = "livecoding_" + key;

            if (merge && newData instanceof Object) {
                data[name] = Helpers.object.merge(oldData, newData);
            } else if (merge && newData instanceof Array) {
                data[name] = Helpers.array.union(oldData, newData);
            } else {
                data[name] = newData;
            }

            browser.store(data, true).then(function() {
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    this.clearByKey = function(key) {
        var deferred = $q.defer();
        var data = {};
        var name = "livecoding_" + key;
        data[name] = {};

        browser.store(data, true).then(function () {
            deferred.resolve();
        });

        return deferred.promise;
    };
}]);