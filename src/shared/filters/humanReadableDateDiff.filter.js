angular
    .module("app")
    .filter("humanReadableDateDiff", humanReadableDateDiff);

humanReadableDateDiff.$inject = [];

/**
 * Human readable date difference filter (english only)
 * @usage:
 *   <span>Time left: {{myDateTimeObj|humanReadableDateDiff}}.</span>
 * Example result:
 *   <span>Time left: 2 Hours, 3 Minutes.</span>
 */
function humanReadableDateDiff() {
    /**
     * Get object describing difference in time between two DateTime objects
     * @param fromDate (Date object)
     * @param toDate (Date object)
     * @return object of structure:
       {
         (int) years
         (int) months
         (int) days
         (int) hours
         (int) minutes
         (int) seconds
       }
     * No integer will be below zero
     */
    function dateDiff(fromDate, toDate) {
        var startDate = new Date(1970, 0, 1, 0).getTime(),
            diff = toDate - fromDate,
            date = new Date(startDate + diff),
            years = date.getFullYear() - 1970,
            months = date.getMonth(),
            days = date.getDate() - 1,
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            diffDate = {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };

        if (years < 0) return diffDate;

        diffDate.years = years > 0 ? years : 0;
        diffDate.months = months > 0 ? months : 0;
        diffDate.days = days > 0 ? days : 0;
        diffDate.hours = hours > 0 ? hours : 0;
        diffDate.minutes = minutes > 0 ? minutes : 0;
        diffDate.seconds = seconds > 0 ? seconds : 0;

        return diffDate;
    }

    /**
     * Get a readable string describing time difference between input and now
     * @param date (Date object)
     * @return string
     */
    return function (date) {
        if (!date)
            return;

        var obj = dateDiff(Date.now(), new Date(date)),
            output = [],
            times = [
                {label: "Year",   value: obj.years},
                {label: "Month",  value: obj.months},
                {label: "Day",    value: obj.days},
                {label: "Hour",   value: obj.hours},
                {label: "Minute", value: obj.minutes}
                //{label: "Second", value: obj.seconds} // TODO: This is specific to the project!
            ];

        times.forEach(function(item, index) {
            if (index !== lang.length - 1 && item.value === 0)
                return;

            var plural = item.value > 1,
                sentance = item.value + " " + item.label;

            if (plural)
                sentance += "s";

            output.push(sentance);
        });

        return output.join(", ") + ".";
    };
}