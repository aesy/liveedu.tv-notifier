angular
    .module("app")
    .service("livecodingAPIService", livecodingAPIService);

livecodingAPIService.$inject = ["$http", "$q"];


function livecodingAPIService($http, $q) {
    var baseUrl= "https://www.livecoding.tv",
        newTokenCallbacks = [],
        accessToken = {},
        config = {
            clientId: "3uXPPL5p7PuKEPgwn5vEbK6TmGQO4YfD5rVRGn6Z",
            clientSecret: "fy2VvRhk3oFARzZjM5lNyYsOcpP5B2c4eKoxm2GfOKWsh8TkpNuReOw9R7InjqEZaHKdzGK4hMYAdMeGzqV0CCew1qFLYiZw9UHIKv7hU6r47tQU8PSUF585bzGbiMQ4",
            scope: ["read:user"],
            redirectUri: "https://www.easy-peasy.se/LiveCoding.tv-Notifier/"
            //redirectUri: browser.getExtensionURL() + "auth.html" // TODO: notify livecoding support that redirects to chrome extentions are not allowed.
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

    function onNewToken(callback) {
        newTokenCallbacks.push(callback);
    }

    function fireNewToken() {
        newTokenCallbacks.forEach(function(func) {
            func(accessToken);
        });
    }

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

    function getCurrentUser() {
        return get("/api/user/", {}, AuthConfig());
    }

    function getFollowing() {
        var deferred = $q.defer();

        get("/api/user/followers/", {}, AuthConfig()).then(function(response) {
            deferred.resolve(response.data);
        });

        return deferred.promise;
    }

    function setAccessToken(obj) {
        accessToken = obj;
        fireNewToken(accessToken);
    }

    function getAccessToken(code) {
        var params = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: config.redirectUri
        };

        return post("/o/token/", params, AccessTokenConfig());
    }

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
                expires_at: timestamp_seconds() + response.data.expires_in,
                scope: response.data.scope.split(" ")
            });

            deferred.resolve();
        });

        return deferred.promise;
    }

    function revokeToken() {
        setAccessToken({});
    }

    function authorize(code) {
        var deferred = $q.defer();

        getAccessToken(code).then(function(response) {
            setAccessToken({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: timestamp_seconds() + response.data.expires_in,
                scope: response.data.scope.split(" ")
            });

            deferred.resolve();
        }, function() {
            deferred.reject();
        });

        return deferred.promise;
    }

    function isAuthenticated() {
        return angular.isDefined(accessToken.access_token);
    }

    function get(url, params, config) {
        config.params = params;

        var deferred = $q.defer();

        $http.get(baseUrl + url, config).then(function(response) {
            deferred.resolve(response);
        }, errorHandlerFactory(deferred));

        return deferred.promise;
    }

    function post(url, params, config) {
        url = baseUrl + url;

        var deferred = $q.defer();

        $http.post(url, params, config).then(function(response) {
            deferred.resolve(response);
        }, errorHandlerFactory(deferred));

        return deferred.promise;
    }

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

    function errorHandlerFactory(deferred) {
        deferred = deferred || $q.defer();

        return function(e) {
            if (e.status !== 403 || !isAuthenticated()) {
                deferred.reject(e);
                return;
            }

            console.log("Error code 403", e);
            refreshToken().then(function() {
                console.log("Token succesfully refreshed");
                var config = e.config;
                config.headers = AuthConfig().headers;

                return $http(config).then(function(response) {
                    console.log("Now able to make request", response);
                    deferred.resolve(response.data);
                }, function(e) {
                    console.log("Unable to make request anyway");
                    deferred.reject(e);
                });
            }, function(e) {
                console.log("Couldn't refresh token", e);
                deferred.reject(e);
            });
        };
    }

    /*
     * Encode request data like jQuery.post (formdata) instead of the default JSON request payload
     * http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
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


function liveCodingStream(stream) {
    return stream.map(function(value) {
        return {
            username: value.user.match(/^.*\/(.+)\//)[1] || "",
            url: (value.url || "").replace("api/livestreams/", ""),
            title: value.title || "",
            description: value.description || "",
            country: value.language || "",
            tags: value.tags || value.product_type || "",
            difficulty: value.difficulty || "",
            category: value.coding_category || "",
            views: value.viewers_live || value.viewers_overall || 0,
            timestamp: Date.parse(value.start_time || 0),
            dateTime: new Date(value.start_time || 0)
        };
    });
}

function timestamp_seconds() {
    return Math.floor(new Date().getTime() / 1000);
}

function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}