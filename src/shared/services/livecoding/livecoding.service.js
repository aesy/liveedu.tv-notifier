angular
    .module("app")
    .service("livecodingService", livecodingService);

livecodingService.$inject = ["$q", "lodash", "browserService", "livecodingAPIService"];

/*
 * Wrapping service for livecodingAPIService
 * which stores and persists the token in browsers storage.
 * Use this instead of livecodingAPIService.
 */
function livecodingService($q, _, browser, livecodingAPI) {
    var storageKey = "livecodingToken";

    livecodingAPI.onNewToken(function(token) {
        browser.storage.local.set(storageKey, token);
    });

    return {
        promise: setTokenIfAvailable(),
        authenticate: authenticate,
        authorize: livecodingAPI.authorize,
        getFollowing: livecodingAPI.getFollowing,
        getAllLive: livecodingAPI.getLivestreams,
        getAllVideos: livecodingAPI.getVideos,
        getAllScheduled: livecodingAPI.getScheduled,
        isAuthenticated: livecodingAPI.isAuthenticated,
        revokeToken: livecodingAPI.revokeToken
    };

    function setTokenIfAvailable() {
        var deferred = $q.defer();

        browser.storage.local.get(storageKey).then(function(data) {
            if (data && !_.isEmpty(data))
                livecodingAPI.setAccessToken(data);

            deferred.resolve();
        });

        return deferred.promise;
    }

    function authenticate() {
        browser.openTab(livecodingAPI.getAuthorizeUrl());
    }
}