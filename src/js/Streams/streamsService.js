app.service("streamService", ["$http", "$q", function($http, $q) {
    function getAllLive() {
        var deferred = $q.defer();
        var request = $http.get('http://apiapp.cubecamp.com/livecoding/livestreams.json');

        request.success(function (response) {
            deferred.resolve(response.livestreams);
        });

        request.error(handleError);

        return deferred.promise;
    }

    function getAllVideos() {
        var deferred = $q.defer();
        var request = $http.get('http://apiapp.cubecamp.com/livecoding/videos.json');

        request.success(function (response) {
            deferred.resolve(response.videos);
        });

        request.error(handleError);

        return deferred.promise;
    }

    function getAllScheduled() {
        var deferred = $q.defer();
        var request = $http.get('http://apiapp.cubecamp.com/livecoding/schedule.json');

        request.success(function (response) {
            deferred.resolve(response.schedule);
        });

        request.error(handleError);

        return deferred.promise;
    }

    function handleError(response) {
        console.log("$http error in streamService!! " + response);
    }

    return {
        getAllLive: getAllLive,
        getAllScheduled: getAllScheduled,
        getAllVideos: getAllVideos
    };
}]);