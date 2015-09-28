app.service("streamService", ["$http", function($http) {
    function getAllLive() {
        var request = $http.get('secret');

        return request.then(handleSuccess, handleError);
    }

    function getAllScheduled() {
        var request = $http.get('secret');

        return request.then(handleSuccess, handleError);
    }

    function getAllVideos() {
        var request = $http.get('secret');

        return request.then(handleSuccess, handleError);
    }

    function handleError(response) {

    }

    function handleSuccess(response) {
        return response;
    }

    return ({
        getAllLive: getAllLive,
        getAllScheduled: getAllScheduled,
        getAllVideos: getAllVideos
    });
}]);