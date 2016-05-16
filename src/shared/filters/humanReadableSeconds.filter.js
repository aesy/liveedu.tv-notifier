angular
    .module("app")
    .filter("humanReadableSeconds", humanReadableSeconds);

humanReadableSeconds.$inject = ["$filter"];

/**
 * Human readable seconds filter (english only)
 * @usage:
 *   <span>{{seconds|humanReadableSeconds: "minute"}}.</span>
 * Example result:
 *   <span>5 Seconds</span>
 */
function humanReadableSeconds($filter) {
    /**
     * Get a readable string describing number of seconds
     * @param input (int)
     * @param accuracy (optional string) one of: year, month, day, hour, minute, second
     * @param skip (array)
     * @return string
     */
    return function (seconds, accuracy) {
        if (!angular.isNumber(seconds))
            return;

        return $filter("humanReadableDateDiff")
                      (new Date(Date.now() + seconds*1000), accuracy);
    };
}