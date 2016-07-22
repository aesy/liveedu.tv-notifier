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
            lastSeen: Date.now()
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
                seen[i].lastSeen = Date.now();
                return;
            }
        }

        addSeen(username);
    }

    /**
     * Get recently (since last check) seen users
     * @param offset (optional int) seconds
     * @return array of strings
     */
    function getRecentlySeen(offset) {
        return seen.filter(function(value) {
            return value.lastSeen >= lastCheck - (offset*1000 || 0);
        }).map(function(value) {
            return value.username;
        });
    }

    /**
     * Get list of unseen streams that are currently on-air
     * @read liveCodingStream documentation in livecodingService
     * @return Promise with array of liveCodingStream objects
     */
    function getUnseenLiveStreams() {
        var deferred = $q.defer(),
            previouslySeen = getRecentlySeen(downtimeCooldown);

        livecoding.getAllLive().then(function(livestreams) {
            livestreams = livestreams.filter(function(stream) {
                updateSeen(stream.username);

                return !_.includes(previouslySeen, stream.username);
            });

            deferred.resolve(livestreams);
        });

        lastCheck = Date.now();

        return deferred.promise;
    }
}