angular
    .module("app")
    .filter("humanReadableSeconds", humanReadableSeconds);

humanReadableSeconds.$inject = [];

/**
 * Human readable seconds filter (english only)
 * @usage:
 *   <span>Time left: {{seconds|humanReadableSeconds: "hour"}}.</span>
 * Example result:
 *   <span>Time left: 2 Hours.</span>
 */
function humanReadableSeconds() {
    /**
     * Get object describing difference in time between two DateTime objects
     * @param time1 (Date object)
     * @param time2 (Date object)
     * @param skip (array)
     * @return object of structure:
       {
         (int) days
         (int) hours
         (int) minutes
         (int) seconds
       }
     * No integer will be below zero
     */
    function timeDiff(time1, time2, skip) {
        var result = { days: 0, hours: 0, minutes: 0, seconds: 0 },
            from = Math.max(time1, time2),
            to = Math.min(time1, time2);

        for (var unit in result) {
            if (skip.indexOf(unit) > -1)
                continue;

            var denominators = { days: 86400, hours: 3600, minutes: 60, seconds: 1 },
                denominator = denominators[unit],
                diff = from - to,
                value = Math.floor(diff / denominator);

            to += Math.floor(denominator * value);
            result[unit] += value;
        }

        return result;
    }

    /**
     * Get a readable string describing time difference between input and now
     * @param seconds (int)
     * @param isTimestamp (bool)
     * @param accuracy (optional string) one of: year, month, day, hour, minute, second
     * @param skip (optional array)
     * @return string
     */
    return function (seconds, isTimestamp, accuracy, skip) {
        if (!angular.isNumber(seconds))
            return;

        var diff = timeDiff(seconds, isTimestamp ? Date.now() / 1000 : 0, skip || []),
            output = [],
            times = [
                {label: "Day",    value: diff.days },
                {label: "Hour",   value: diff.hours },
                {label: "Minute", value: diff.minutes },
                {label: "Second", value: diff.seconds }
            ];

        for (var i in times) {
            var item = times[i];

            if (item.value <= 0)
                continue;

            var plural = item.value !== 1,
                sentance = item.value + " " + item.label;

            if (plural)
                sentance += "s";

            output.push(sentance);

            if (accuracy && item.label.toLowerCase() == accuracy)
                break;
        }

        if (!output.length)
            return "0 Seconds";

        return output.join(", ");
    };
}