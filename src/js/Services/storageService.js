app.service("storageService", ["$q", function($q) {

    return ({
        getSettings: getSettings,
        getSeen: getSeen,
    });

    function getSettings() {
        getAll().then(function (data) {
            return data.settings || {};
        });
    }

    function getSeen() {
        getAll().then(function (data) {
            return data.seen || {};
        });
    }

    function getAll() {
        var deffered = $q.defer();
        var name = "livecoding";

        chrome.storage.sync.get(name, function (data) {
            deffered.resolve(data[name] || {});
        });

        return deffered.promise;
    }
}]);