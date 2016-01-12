angular
    .module("app")
    .service("pollingService", pollingService);

pollingService.$inject = ["$q", "$interval", "lodash", "streamService", "notificationFactory", "browserService"];

function pollingService($q, $interval, _, streams, Notification, browser) {
    //var promise,
    //    seen = [],
    //    favorites = [],
    //    settings = {};
    //
    //updateSettings().then(function() {
    //    start();
    //    poll();
    //});
    //
    //return {};
    //
    //function start() {
    //    stop();
    //
    //    promise = $interval(function() {
    //        updateSettings().then(poll);
    //    }, settings.pollingRate * 1000);
    //}
    //
    //function stop() {
    //    $interval.cancel(promise);
    //}
    //
    //function poll() {
    //    streams.getAllLive().then(function (livestreams) {
    //        var count = 0;
    //
    //        for (var i in livestreams) {
    //            var stream = livestreams[i];
    //
    //            if (!_.contains(favorites, stream.username))
    //                continue;
    //
    //            if (_.contains(seen, stream.username))
    //                continue;
    //            else
    //                seen.push(stream.username);
    //
    //            if (count === 0 && settings.sound)
    //                new Audio(settings.sound).play();
    //
    //            new Notification({
    //                title: stream.username + 's stream just went live!',
    //                message: stream.tags + (stream.title ? ': ' + stream.title : ''),
    //                url: 'https://www.livecoding.tv/' + stream.username
    //            }).display();
    //
    //            count++;
    //        }
    //
    //        browser.getBadge().then(function (currentCount) {
    //            browser.setBadge((parseInt(currentCount) || 0) + count);
    //        });
    //    });
    //}
    //
    //function updateSettings() {
    //    var favdeferred = $q.defer();
    //    storage.getFavorites().then(function (data) {
    //        favorites = data || [];
    //        favdeferred.resolve();
    //    });
    //
    //    var optdeferred = $q.defer();
    //    storage.getSettings().then(function (data) {
    //        settings = data;
    //        optdeferred.resolve();
    //    });
    //
    //    return $q.all([favdeferred.promise, optdeferred.promise]);
    //}
}
