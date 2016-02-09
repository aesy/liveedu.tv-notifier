angular
    .module("app")
    .filter("humanReadableSeconds", humanReadableSeconds);

humanReadableSeconds.$inject = [];

/**
 * Human readable seconds filter (english only)
 * @usage:
 *   <span>{{seconds|humanReadableSeconds}}</span>
 * Example result:
 *   <span>5 Seconds</span>
 */
function humanReadableSeconds() {
    /**
     * Get a readable string describing number of seconds
     * @param input (int)
     * @return string
     */
    return function (input) {
        if (!input)
            return;

        var output = [],
            hours = Math.floor(input / 3600),
            divisor_for_minutes = input % 3600,
            minutes = Math.floor(divisor_for_minutes / 60),
            seconds = Math.ceil(divisor_for_minutes % 60),
            times = [
                {label: "Hour",   value: hours},
                {label: "Minute", value: minutes},
                {label: "Second", value: seconds}
            ];

        times.forEach(function(item) {
            if (item.value <= 0)
                return;

            var plural = item.value > 1,
                sentance = item.value + " " + item.label;

            if (plural)
                sentance += "s";

            output.push(sentance);
        });

        if (output.length === 0)
            return "0 Seconds.";

        return output.join(", ") + ".";
    };
}