angular
    .module("app")
    .filter("humanReadableDateDiff", humanReadableDateDiff);

humanReadableDateDiff.$inject = [];

/**
 * Human readable date difference filter (english only)
 * @usage:
 *   <span>Time left: {{myDateTimeObj|humanReadableDateDiff: "hour"}}.</span>
 * Example result:
 *   <span>Time left: 2 Hours, 3 Minutes.</span>
 */
function humanReadableDateDiff() {
    /**
     * Get object describing difference in time between two DateTime objects
     * @param date1 (Date object)
     * @param date2 (Date object)
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
    function dateDiff(date1, date2, skip) {
        var result = { days: 0, hours: 0, minutes: 0, seconds: 0 },
            fromDate = Math.max(date1, date2),
            toDate = Math.min(date1, date2);

        for (var unit in result) {
            if (skip.indexOf(unit) > -1)
                continue;

            var denominators = { days: 864e5, hours: 36e5, minutes: 6e4, seconds: 1e3 },
                denominator = denominators[unit],
                diff = fromDate - toDate,
                value = Math.floor(diff / denominator);

            toDate += Math.floor(denominator * value);
            result[unit] += value;
        }

        return result;
    }

    /**
     * Get a readable string describing time difference between input and now
     * @param date (Date object)
     * @param accuracy (optional string) one of: year, month, day, hour, minute, second
     * @param skip (array)
     * @return string
     */
    return function (date, accuracy, skip) {
        if (!angular.isDate(new Date(date)))
            return;

        var diff = dateDiff(new Date(), new Date(date), skip || []),
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