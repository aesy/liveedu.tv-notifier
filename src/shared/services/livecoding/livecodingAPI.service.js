angular
    .module("app")
    .service("livecodingAPIService", livecodingAPIService);

livecodingAPIService.$inject = ["$http", "$q"];

/**
 * Service for using LiveCoding.tvs' public API.
 */
function livecodingAPIService($http, $q) {
    var baseUrl= "https://www.livecoding.tv",
        newTokenCallbacks = [],
        accessToken = {},
        config = { // set in API wrapper?
            clientId: "3uXPPL5p7PuKEPgwn5vEbK6TmGQO4YfD5rVRGn6Z",
            clientSecret: "fy2VvRhk3oFARzZjM5lNyYsOcpP5B2c4eKoxm2GfOKWsh8TkpNuReOw9R7InjqEZaHKdzGK4hMYAdMeGzqV0CCew1qFLYiZw9UHIKv7hU6r47tQU8PSUF585bzGbiMQ4",
            scope: ["read:user"],
            redirectUri: "https://www.easy-peasy.se/LiveCoding.tv-Notifier/"
            //redirectUri: browser.page.getBaseUrl() + "auth.html" // TODO: notify livecoding support that redirects to chrome extentions are not allowed.
        };

    return {
        getLivestreams: getLivestreams,
        getVideos: getVideos,
        getScheduled: getScheduled,
        getCurrentUser: getCurrentUser,
        getFollowing: getFollowing,

        getAuthorizeUrl: getAuthorizeUrl,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        refreshToken: refreshToken,
        revokeToken: revokeToken,
        onNewToken: onNewToken,
        authorize: authorize,
        isAuthenticated: isAuthenticated
    };

    /**
     * Add new access token listener
     * @param callback (function)
     * @return undefined
     */
    function onNewToken(callback) {
        newTokenCallbacks.push(callback);
    }

    /**
     * Call all new access token listeners
     * @return undefined
     */
    function fireNewTokenEvent() {
        newTokenCallbacks.forEach(function(func) {
            func(accessToken);
        });
    }

    /**
     * Get authorization URL
     * @return string
     */
    function getAuthorizeUrl() {
        return [
            baseUrl,
            "/o/authorize/?client_id=" + config.clientId,
            "&response_type=code",
            "&state=" + generateGUID(),
            "&redirect_uri=" + encodeURIComponent(config.redirectUri),
            "&scope=" + config.scope.join("+")
        ].join("");
    }

    /**
     * Get list of streams on-air
     * @return Promise with array of liveCodingStream objects
     */
    function getLivestreams() {
        var deferred = $q.defer();

        get("/api/livestreams/onair/", {}, {}).then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            deferred.resolve(liveCodingStream(results));
        });

        return deferred.promise;
    }

    /**
     * Get list of recent recorded streams
     * @return Promise with array of liveCodingStream objects
     */
    function getVideos() {
        var deferred = $q.defer();

        var params = {
            //ordering: "creation_time"
        };

        get("/api/videos/", params, {}).then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            deferred.resolve(liveCodingStream(results));
        });

        return deferred.promise;
    }

    /**
     * Get list of scheduled streams
     * @param offset (optional int)
     * @return Promise with array of liveCodingStream objects
     */
    function getScheduled(offset) {
        var deferred = $q.defer();

        var params = {
            limit: 100,
            offset: offset || 0
        };

        get("/api/scheduledbroadcast/", params, {}).then(function(response) {
            var results = response.data.results;

            if (!(results instanceof Array))
                deferred.reject();

            deferred.resolve(liveCodingStream(results));
        });

        return deferred.promise;
    }

    /**
     * Get information about the current user
     * @return http promise
     */
    function getCurrentUser() {
        return get("/api/user/", {}, AuthConfig());
    }

    /**
     * Get list of users the current user follows
     * @return Promise with array of user objects
     */
    function getFollowing() {
        var deferred = $q.defer();

        get("/api/user/follows/", {}, AuthConfig()).then(function(response) {
            var users = response.data;

            deferred.resolve(users);
        });

        return deferred.promise;
    }

    /**
     * Set token object, must be of format:
     {
       (string) access_token
       (string) refresh_token
       (int)    expires_at
       (array of strings) scope
     }
     * @return undefined
     */
    function setAccessToken(obj) {
        accessToken = obj;
        fireNewTokenEvent();
    }

    /**
     * Request an access token using authorization code
     * @param code (string)
     * @return http promise
     */
    function getAccessToken(code) {
        var params = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: config.redirectUri
        };

        return post("/o/token/", params, AccessTokenConfig());
    }

    /**
     * Request an access token using refresh token
     * @return Promise
     */
    function refreshToken() {
        var params = {
            grant_type: "refresh_token",
            refresh_token: accessToken.refresh_token
        };

        var deferred = $q.defer();

        post("/o/token/", params, AccessTokenConfig()).then(function(response) {
            setAccessToken({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: timestampSeconds() + response.data.expires_in,
                scope: response.data.scope.split(" ")
            });

            deferred.resolve();
        });

        return deferred.promise;
    }

    /**
     * Revoke token
     * No API requests are made, token object is emptied (set to {}).
     * @return undefined
     */
    function revokeToken() {
        setAccessToken({});
    }

    /**
     * TODO: Merge this with getAccessToken() and get rid of listeners
     */
    function authorize(code) {
        var deferred = $q.defer();

        getAccessToken(code).then(function(response) {
            setAccessToken({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: timestampSeconds() + response.data.expires_in,
                scope: response.data.scope.split(" ")
            });

            deferred.resolve();
        }, function() {
            deferred.reject();
        });

        return deferred.promise;
    }

    /**
     * Check if user is authenticated
     * @return boolean
     */
    function isAuthenticated() {
        return angular.isDefined(accessToken.access_token);
    }

    /**
     * Http get request wrapper
     * Will refresh access token if necessary
     * @param url (string) NOT containing LiveCoding base URL
     * @param params (object) additional parameters
     * @param config (AccessTokenConfig object | AuthConfig object)
     * @return Promise with http response
     */
    function get(url, params, config) {
        config.params = params;

        var deferred = $q.defer();

        $http.get(baseUrl + url, config).then(function(response) {
            deferred.resolve(response);
        }, errorHandlerFactory(deferred));

        return deferred.promise;
    }

    /**
     * Http post request wrapper
     * Will refresh access token if necessary
     * @param url (string) NOT containing LiveCoding base URL
     * @param params (object)
     * @param config (AccessTokenConfig object | AuthConfig object)
     * @return Promise with http response
     */
    function post(url, params, config) {
        var deferred = $q.defer();

        $http.post(baseUrl + url, params, config).then(function(response) {
            deferred.resolve(response);
        }, errorHandlerFactory(deferred));

        return deferred.promise;
    }

    /**
     * Get http config for access token related requests
     * @return object
     */
    function AccessTokenConfig() {
        return {
            headers: {
                Authorization: "Basic " + btoa(config.clientId + ":" + config.clientSecret),
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            withCredentials: true,
            transformRequest: [
                function(data) {
                    return angular.isObject(data) && String(data) !== "[object File]" ? param(data) : data;
                }
            ]
        };
    }

    /**
     * Get http config for requests that require user to be authenticated
     * Throws an error if user is not authenticated
     * @return object
     */
    function AuthConfig() {
        if (!isAuthenticated())
            throw Error("livecodingAPI Service: Not Authenticated.");

        return {
            headers: {
                Authorization: "Bearer " + accessToken.access_token
            },
            withCredentials: true,
            transformRequest: [
                function(data) {
                    return angular.isObject(data) && String(data) !== "[object File]" ? param(data) : data;
                }
            ]
        };
    }

    /**
     * Http request error handler factory
     * Error handler will refresh token on error code 403 and make another request with the new token (one try)
     * Will resolve (@param deferred) if new request succeeds.
     * @param deferred (optional Deferred)
     * @return error handler function
     */
    function errorHandlerFactory(deferred) {
        deferred = deferred || $q.defer();

        return function(e) {
            if (e.status !== 403 || !isAuthenticated()) {
                deferred.reject(e);
                return;
            }

            refreshToken().then(function() {
                var config = e.config;
                config.headers = AuthConfig().headers;

                return $http(config).then(function(response) {
                    deferred.resolve(response);
                }, function(e) {
                    deferred.reject(e);
                });
            }, function(e) {
                deferred.reject(e);
            });
        };
    }

    /**
     * Encode request data like jQuery.post (formdata) instead of the default JSON request payload
     * @param obj (any) item to encode
     * @read http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
     */
    function param(obj) {
        var query = "";

        for (var name in obj) {
            var value = obj[name];

            if (value instanceof Array) {
                value.forEach(function(subValue, i) {
                    var fullSubName = name + "[" + i + "]";
                    var innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                });
            } else if (value instanceof Object) {
                for (var subName in value) {
                    var subValue = value[subName];
                    var fullSubName = name + "[" + subName + "]";
                    var innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }
}


/**
 * Get prettified stream object
 * @param stream (object) raw stream object from API http response
 * @return object of format:
 {
  (string) username
  (string) url
  (string) title
  (string) description
  (string) country
  (string) tags
  (string) difficulty
  (string) category
  (int) views
  (int) timestamp
  (Date) dateTime
 }
 */
function liveCodingStream(stream) {
    return stream.map(function(value) {
        return {
            username: (value.user || value.livestream).match(/^.*\/(.+)\//)[1] || "",
            url: (value.url || value.livestream || "").replace("api/livestreams/", ""),
            title: value.title || "",
            description: value.description || "",
            country: value.language || "",
            tags: value.tags || value.product_type || "",
            difficulty: value.difficulty || "",
            category: value.coding_category || "",
            views: value.viewers_live || value.viewers_overall || 0,
            timestamp: Date.parse(value.start_time || 0), // 0 good default?
            dateTime: new Date(value.start_time || 0),
            id: value.id || 0
        };
    });
}

/**
 * Get current timestamp in seconds
 * @return int
 */
function timestampSeconds() {
    return Math.floor(new Date().getTime() / 1000);
}

/**
 * Get GUID
 * @read http://stackoverflow.com/a/2117523/2331968
 * @return string
 */
function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

