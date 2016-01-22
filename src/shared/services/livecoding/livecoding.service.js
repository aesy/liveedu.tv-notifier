angular
    .module("app")
    .service("livecodingService", livecodingService);

livecodingService.$inject = ["$q", "lodash", "browserService", "livecodingAPIService"];


function timestamp_seconds() {
    return Math.floor(new Date().getTime() / 1000);
}


function livecodingService($q, _, browser, livecodingAPI) {
    var storageKey = "livecodingToken",
        hasToken = false;

    browser.storage.local.get(storageKey).then(function(data) {
        if (data && !_.isEmpty(data))
            setToken(data);
    });

    // TODO: sync following

    return {
        getAllLive: getAllLive,
        getAllVideos: getAllVideos,
        getAllScheduled: getAllScheduled,
        isAuthenticated: isAuthenticated,
        authorize: authorize,
        authenticate: authenticate,
        revokeToken: revokeToken
    };

    function isAuthenticated() {
        return hasToken;
    }

    function getAllLive() {
        var deferred = $q.defer();

        livecodingAPI.getLivestreams().then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            results = results.map(function(value) {
                return {
                    username: value.user__slug,
                    url: value.url,
                    title: value.title,
                    description: value.description,
                    country: value.language,
                    tags: value.tags || "",
                    difficulty: value.difficulty,
                    category: value.coding_category || "",
                    views: value.viewers_live
                }
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    }

    function getAllVideos() {
        var deferred = $q.defer();

        livecodingAPI.getVideos().then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            results = results.map(function(value) {
                return {
                    username: value.user.match(/^.*\/(.+)\//)[1],
                    url: value.url,
                    title: value.title,
                    description: value.description,
                    country: value.language,
                    tags: value.product_type || "",
                    difficulty: value.difficulty,
                    category: value.coding_category || "",
                    views: value.viewers_overall
                }
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    }

    function getAllScheduled() {
        var deferred = $q.defer();

        livecodingAPI.getScheduled().then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            results = results.map(function(value) {
                return {
                    username: value.livestream.match(/^.*\/(.+)\//)[1],
                    url: value.livestream,
                    title: value.title,
                    description: value.description,
                    country: value.language,
                    tags: "",
                    difficulty: value.difficulty,
                    category: value.coding_category || "",
                    date_full: Date.parse(value.start_time)
                }
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    }

    function setToken(obj) {
        hasToken = true;
        livecodingAPI.setAccessToken(obj);
    }

    function revokeToken() {
        hasToken = false;
        browser.storage.local.clear(storageKey);

        return livecodingAPI.revokeToken() || $q.defer().promise;
    }

    function authorize(code) {
        var deferred = $q.defer();

        livecodingAPI.getAccessToken(code).then(function(response) {
            var data = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: timestamp_seconds() + response.data.expires_in,
                scope: response.data.scope.split(" ")
            };

            browser.storage.local.set(storageKey, data);
            setToken(data);

            deferred.resolve();
        });

        return deferred.promise;
    }

    function authenticate() {
        browser.openTab(livecodingAPI.getAuthorizeUrl());
    }
}