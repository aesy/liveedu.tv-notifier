angular
    .module("app")
    .service("livecodingService", livecodingService);

livecodingService.$inject = ["$q", "lodash", "browserService", "livecodingAPIService"];

/**
 * Wrapping service for livecodingAPIService
 * which stores and persists the token in browsers storage.
 * Use this instead of livecodingAPIService.
 */
function livecodingService($q, _, browser, livecodingAPI) {
    var storageKey = "livecodingToken",
        callbacks = {};

    // TODO: onNewToken is to be removed, don't use.
    livecodingAPI.onNewToken(function(token) {
        browser.storage.local.set(storageKey, token);
    });

    setTokenIfAvailable().then(function() {
        fire("ready");
    });

    return {
        authenticate: authenticate,
        authorize: livecodingAPI.authorize,
        getFollowing: livecodingAPI.getFollowing,
        filteredLivestreams: filteredLivestreams,
        getAllLive: livecodingAPI.getLivestreams,
        getAllVideos: livecodingAPI.getVideos,
        getAllScheduled: livecodingAPI.getScheduled,
        isAuthenticated: livecodingAPI.isAuthenticated,
        revokeToken: livecodingAPI.revokeToken,
        on: on
    };

    /**
     * Add event listener
     * @param event (string one of ('ready'))
     * @param callback (function)
     * @return undefined
     */
    function on(event, callback) {
        switch (event) {
            case "ready":
                if (!callbacks.hasOwnProperty(event))
                    callbacks[event] = [];

                callbacks[event].push(callback);

                if (livecodingAPI.isAuthenticated())
                    callback();
                break;
            default:
                throw Error("Invalid event type");
        }
    }

    /**
     * Fire off listener callbacks
     * @param event (string one of ('ready'))
     * @return undefined
     */
    function fire(event) {
        if (!callbacks.hasOwnProperty(event))
            return;

        callbacks[event].forEach(function(callback) {
            callback();
        });
    }

    /**
     * Filter out specific users from API request that returns liveCodingStream objects
     * @param promise (Promise) of livecodingAPI $http request
     * @param usernames (array of strings)
     * @return Promise with array of liveCodingStream objects
     */
    function filteredLivestreams(promise, usernames) {
        var deferred = $q.defer();

        promise.then(function(livestreams) {
            deferred.resolve(livestreams.filter(function(stream) {
                return _.includes(usernames, stream.username.toLowerCase());
            }));
        });

        return deferred.promise;
    }

    /**
     * Set token if available
     * Will look in browser storage for token and use it in future API requests if available
     * @return Promise
     */
    function setTokenIfAvailable() {
        var deferred = $q.defer();

        browser.storage.local.get(storageKey).then(function(data) {
            if (data && !_.isEmpty(data))
                livecodingAPI.setAccessToken(data);

            deferred.resolve();
        });

        return deferred.promise;
    }

    /**
     * Authenticate
     * Opens new browser tab where user can authorize app
     * @return undefined
     */
    function authenticate() {
        browser.openTab(livecodingAPI.getAuthorizeUrl());
    }
}