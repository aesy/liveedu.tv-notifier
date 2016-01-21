angular
    .module("app")
    .service("livecodingAPIService", livecodingAPIService);

livecodingAPIService.$inject = ["$http"];


function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function livecodingAPIService($http) {
    var baseUrl= "https://www.livecoding.tv",
        accessToken = {},
        config = {
            clientId: "3uXPPL5p7PuKEPgwn5vEbK6TmGQO4YfD5rVRGn6Z",
            clientSecret: "fy2VvRhk3oFARzZjM5lNyYsOcpP5B2c4eKoxm2GfOKWsh8TkpNuReOw9R7InjqEZaHKdzGK4hMYAdMeGzqV0CCew1qFLYiZw9UHIKv7hU6r47tQU8PSUF585bzGbiMQ4",
            scope: ["read:user"],
            redirectUri: "https://www.easy-peasy.se/LiveCoding.tv-Notifier/"
            //redirectUri: browser.getURL() + "auth.html" // TODO: notify livecoding support that redirects to chrome extentions are not allowed.
        };

    return {
        getLivestreams: getLivestreams,
        getVideos: getVideos,
        getScheduled: getScheduled,
        getCurrentUser: getCurrentUser,
        getCurrentUserFollowers: getCurrentUserFollowers,
        getAuthorizeUrl: getAuthorizeUrl,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        refreshToken: refreshToken,
        revokeToken: revokeToken
    };

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
        return get("/api/livestreams/onair/", null, AuthConfig());
    }

    function getVideos() {
        return get("/api/videos/", null, AuthConfig());
    }

    function getScheduled() {
        return get("/api/scheduledbroadcast/", null, AuthConfig());
    }

    function getCurrentUser() {
        return get("/api/user/", null, AuthConfig());
    }

    function getCurrentUserFollowers() {
        return get("/api/user/followers/", null, AuthConfig());
    }

    function setAccessToken(obj) {
        accessToken = obj;
    }

    function getAccessToken(code) {
        var authCode = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: config.redirectUri
        };

        return $http.post(baseUrl + "/o/token/", authCode, AccessTokenConfig());
    }

    function refreshToken(refresh_token) {
        var authCode = {
            grant_type: "refresh_token",
            refresh_token: refresh_token
        };

        return $http.post(baseUrl + "/o/token/", authCode, AccessTokenConfig());
    }

    function revokeToken() {
        accessToken = null;
    }

    function isAuthorized() {
        return angular.isDefined(accessToken.access_token);
    }

    function get(url, params, config) {
        config.params = params;
        return $http.get(baseUrl + url, config);
    }

    function post(url, params, config) {
        url = baseUrl + url;

        return $http.post(url, params, config);
    }

    // This $http config is used to exchange the request token for a user access token
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

    // This $http config is used for all reddit API calls after OAuth is complete
    function AuthConfig() {
        if (!isAuthorized())
            return {};

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