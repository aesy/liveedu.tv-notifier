app.service("storageService", ["$q", function($q) {

    this.getSettings = function() {
        return this.getByKey("settings");
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
        var deffered = $q.defer();
        var name = "livecoding_" + key;

        chrome.storage.sync.get(name, function (data) {
            deffered.resolve(data[name] || {});
        });

        return deffered.promise;
    };

    this.setByKey = function(key, newData, merge) {
        var deffered = $q.defer();

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

            chrome.storage.sync.set(data, function() {
                deffered.resolve();
            });
        });

        return deffered.promise;
    };

    this.clearByKey = function(key) {
        var deffered = $q.defer();
        var data = {};
        var name = "livecoding_" + key;
        data[name] = {};

        chrome.storage.sync.set(data, function () {
            deffered.resolve();
        });

        return deffered.promise;
    };
}]);