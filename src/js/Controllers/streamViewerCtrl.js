app.controller("streamViewerCtrl",
    ["$scope", "$interval", "streamService", "storageService", "arrayUtils", function($scope, $interval, stream, storage, array) {

    $scope.category = "country";
    $scope.subcat = "1";
    $scope.streams = [
        {
            title: "test1",
            name: "name1",
            language: "C--",
            url: "192.168.0.1",
            favorite: false,
            image: "",
            viewers: 2,
            country: '1',
            tags: ["Javascript"]
        },
        {
            title: "test2",
            name: "name2",
            language: "E",
            url: "192.168.0.1",
            favorite: true,
            image: "",
            viewers: 50,
            country: '1',
            tags: ["PHP"]
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
        var seen = storage.getSeen();
        var notSeen = [];

        for (var i in videos) {
            var liveStream = videos[i];

            for (var j in seen) {
                var seenStream = seen[i];

                if (seenStream.name == liveStream.name && (Date.now() - seenStream.time) < timeDiff) {
                    notSeen.push(liveStream);
                    break;
                }
            }
        }

        $scope.notify();
    };

    $scope.filter = function(stream) {
        var values = [];

        if ($scope.filterInput) {
            var name = array.contains($scope.filterInput, stream.name);
            var title = array.contains($scope.filterInput, stream.title);

            values.push(array.any([name, title]));
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

        return array.all(values);
    };

    //$interval(function() { $scope.poll(); }, 30000);
}]);