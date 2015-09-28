angular.module("app").controller("streamViewerCtrl",
    ["$scope", "streamService", "storageService", function($scope, stream, storage) {

    $scope.category = "language";
    $scope.subcat = "C--";
    $scope.streams = [
        {
            title: "test1",
            name: "name1",
            language: "C--",
            url: "192.168.0.1",
            favorite: true,
            image: "",
            viewers: 2,
            country: 'imagineland',
            tags: []
        },
        {
            title: "test2",
            name: "name2",
            language: "E",
            url: "192.168.0.1",
            favorite: true,
            image: "",
            viewers: 50,
            country: 'fairyland',
            tags: []
        }
    ];
    $scope.filterInput = "";

    //var timer = $interval(function () {
    //    stream.getAllLive();
    //
    //    //$rootScope.$broadcast('streams.new');
    //}, 10000);

    $scope.poll = function() {
        var timeDiff = 0;

        var videos = stream.getAllLive();
        //var seen = storageService.getSeen();
        //var notSeen = [];
        //
        //for (var i in videos) {
        //    var liveStream = videos[i];
        //
        //    for (var j in seen) {
        //        var seenStream = seen[i];
        //
        //        if (seenStream.name == liveStream.name && (Date.now() - seenStream.time) < timeDiff) {
        //            notSeen.push(liveStream);
        //            break;
        //        }
        //    }
        //}

        $scope.notify();
    };

    $scope.filter = function(stream) {
        var values = [];

        if ($scope.filterInput) {
            values.push(stream.name.indexOf($scope.filterInput) > -1);
            values.push(stream.title.indexOf($scope.filterInput) > -1);
        }

        switch ($scope.category) {
            case "follow":
                values.push(stream.favorite);
                break;
            case "language":
                values.push($scope.subcat == stream.language);
                break;
            case "country":
                values.push($scope.subcat == stream.country);
                break;
        }

        for (var i in values) {
            if (!values[i]) {
                return false;
            }
        }

        return true;
    };

    $scope.notify = function(streams) {
        // play sound + notification
    };

}]);