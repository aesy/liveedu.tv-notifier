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
        cacheKey = "livecodingCache",
        refreshCacheSeconds = 60 * 30,
        callbacks = {},
        ready = false;

    init();

    return {
        authenticate: authenticate,
        authorize: livecodingAPI.authorize,
        getFollowing: livecodingAPI.getFollowing,
        getAllLive: livecodingAPI.getLivestreams,
        getAllVideos: getVideos,
        getAllScheduled: getAllScheduled,
        isAuthenticated: livecodingAPI.isAuthenticated,
        revokeToken: livecodingAPI.revokeToken,
        on: on
    };

    /**
     * Initialize service
     */
    function init() {
        livecodingAPI.onNewToken(function(token) {
            browser.storage.local.set(storageKey, token);
        });

        setTokenIfAvailable().then(function() {
            fire("ready");
        });
    }

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

                if (event === "ready" && ready)
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
        if (event === "ready")
            ready = true;

        if (!callbacks.hasOwnProperty(event))
            return;

        callbacks[event].forEach(function(callback) {
            callback();
        });
    }

    /**
     * Get list of recent recorded streams
     * Result is cached for an arbitrary amount of time.
     * @return Promise with array of liveCodingStream objects
     */
    function getVideos() {
        var deferred = $q.defer();

        getCache("videos").then(function(cache) {
            if (cache) {
                deferred.resolve(cache);
            } else {
                livecodingAPI.getVideos().then(function(results) {
                    setCache("videos", results);
                    deferred.resolve(results);
                }).catch(deferred.reject);
            }
        });

        return deferred.promise;
    }

    /**
     * Get list of all scheduled streams (not including past broadcasts).
     * It requires approx. 6 http get requests and is therefore cached for an arbitrary amount of time.
     * @return Promise with array of liveCodingStream objects
     */
    function getAllScheduled() {
        var offset = -100,
            results = [],
            deferred = $q.defer();

        var iRequests = function() {
            offset += 100;

            livecodingAPI.getScheduled(offset).then(function(data) {
                for (var i in data) {
                    if (data[i].timestamp > Date.now()) {
                        results.push(data[i]);
                    } else {
                        setCache("scheduled", results);
                        deferred.resolve(results);
                        return;
                    }
                }

                if (data.length)
                    iRequests();
            }).catch(deferred.reject);
        };

        getCache("scheduled").then(function(cache) {
            if (cache) {
                var result = cache.filter(function(stream) {
                    // Remove passed streams
                    return Date.now() < stream.timestamp;
                });

                deferred.resolve(result);
            } else {
                iRequests();
            }
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

    /**
     * Get Cache
     * Get Cached data by key
     * @param key (optional string) Leave empty to get all keys
     * @return Promise
     */
    function getCache(key) {
        var deferred = $q.defer();

        browser.storage.local.get(cacheKey).then(function(result) {
            if (!key) {
                deferred.resolve(result);
                return;
            } else {
                result = (result || {})[key];
            }

            if (!result || Date.now() > result.timestamp + refreshCacheSeconds*1000) {
                clearCache();
                deferred.resolve(null);
                return;
            }

            deferred.resolve(result.data || null);
        });

        return deferred.promise;
    }

    /**
     * Set Cache
     * Cache data for later use
     * @param key (string)
     * @param data (any)
     * @return undefined
     */
    function setCache(key, data) {
        getCache().then(function(obj) {
            obj = obj || {};
            obj[key] = {
                timestamp: Date.now(),
                data: data
            };

            browser.storage.local.set(cacheKey, obj);
        });
    }

    /**
     * Clear Cache
     * Clear cache data
     * @return Promise
     */
    function clearCache() {
        return browser.storage.local.clear(cacheKey);
    }
}