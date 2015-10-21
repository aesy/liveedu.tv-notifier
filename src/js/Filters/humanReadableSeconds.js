app.filter('humanReadableSeconds', [function () {
    return function (seconds_input) {
        if (!seconds_input)
            return;

        var output = [];
        var hours = Math.floor(seconds_input / (60 * 60));
        var divisor_for_minutes = seconds_input % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var seconds = Math.ceil(divisor_for_minutes % 60);

        var times = [
            {label: "Hour",   value: hours},
            {label: "Minute", value: minutes},
            {label: "Second", value: seconds}
        ];

        for (var i in times) {
            var time = times[i];

            if (time.value > 0) {
                output.push(time.value + ' ' + time.label + ((time.value > 1) ? 's' : ''));
            }
        }

        return output.length > 0 ? output.join(', ') + '.' : '0 Seconds.';
    };
}]);