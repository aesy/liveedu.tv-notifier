angular
    .module("app")
    .service("pollingService", pollingService);

pollingService.$inject = ["$q", "lodash", "livecodingService"];

function pollingService($q, _, livecoding) {
    /**
     * List of seen streamers
     * Contins objects with the following structure:
     {
       (string) username
       (int) lastSeen - timestamp in seconds
       (int) downtimeCooldown - seconds of downtime needed to trigger another notification
     }
     */
    var seen = [],
        lastCheck = 0,
        downtimeCooldown = 60 * 15;

    return {
        getUnseenLiveStreams: getUnseenLiveStreams,
        getRecentlySeen: getRecentlySeen
    };

    /**
     * Add username to list of seen users
     * @param username (string)
     * @return undefined
     */
    function addSeen(username) {
        seen.push({
            username: username,
            lastSeen: timestampSeconds()
        });
    }

    /**
     * Update user last seen timestamp
     * @param username (string)
     * @return undefined
     */
    function updateSeen(username) {
        for (var i in seen) {
            var name = seen[i].username;

            if (name == username) {
                seen[i].lastSeen = timestampSeconds();
                return;
            }
        }

        addSeen(username);
    }

    /**
     * Get recently (since last check) seen users
     * @param offset (optional int)
     * @return array of strings
     */
    function getRecentlySeen(offset) {
        return seen.filter(function(value) {
            return value.lastSeen >= lastCheck - (offset || 0);
        }).map(function(value) {
            return value.username;
        });
    }

    /**
     * Get list of unseen streams that are currently on-air
     * @param filter (string or array of strings) filter out specific users
     * @read liveCodingStream documentation in livecodingService
     * @return Promise with array of liveCodingStream objects
     */
    function getUnseenLiveStreams(filter) {
        var deferred = $q.defer(),
            promise = livecoding.getAllLive(),
            previouslySeen = getRecentlySeen(downtimeCooldown);

        livecoding.filteredLivestreams(promise, [].concat(filter)).then(function(livestreams) {
            deferred.resolve(livestreams.filter(function(stream) {
                var username = stream.username;

                updateSeen(username);

                return !_.includes(previouslySeen, username);
            }));
        });

        lastCheck = timestampSeconds();

        return deferred.promise;
    }
}


// TODO: keep it DRY
/**
 * Get current timestamp in seconds
 * @return int
 */
function timestampSeconds() {
    return Math.floor(new Date().getTime() / 1000);
}