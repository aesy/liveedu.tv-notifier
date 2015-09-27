angular.module("app").service("streamService", function($http) {

    return ({
        getAllLive: getAllLive,
        getAllScheduled: getAllScheduled,
        getAllVideos: getAllVideos
    });

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

});