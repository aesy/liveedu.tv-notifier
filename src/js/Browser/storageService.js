app.service("storageService", ["$q", "lodash", "browserService", function($q, _, browser) {

    this.getSettings = function() {
        var defaults = {
            sound: 'snd/Soft1.wav',
            pollingRate: 30
        };

        var deferred = $q.defer();

        this.getByKey("settings").then(function(data) {
            var settings = _.defaultsDeep(data, defaults);
            deferred.resolve(settings);
        });

        return deferred.promise;
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
            deferred.resolve(data || {});
        });

        return deferred.promise;
    };

    this.setByKey = function(key, newData, merge) {
        var deferred = $q.defer();

        this.getByKey(key).then(function(oldData) {
            var data = {};
            var name = "livecoding_" + key;

            if (merge && newData instanceof Object) {
                data[name] = _.defaultsDeep(newData, oldData);
            } else if (merge && newData instanceof Array) {
                data[name] = _.union(newData, oldData);
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