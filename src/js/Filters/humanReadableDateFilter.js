app.filter('humanReadableDate', [function () {
    return function (date) {
        if (!date)
            return;

        var obj = Helpers.date.diff(Date.now(), new Date(date));
        var output = [];

        if (obj.years)
            output.push(obj.years + " Year" + ((obj.years !== 1) ? "s" : ""));

        if (obj.months)
            output.push(obj.months + " Month" + ((obj.months !== 1) ? "s" : ""));

        if (obj.days)
            output.push(obj.days + " Day" + ((obj.days !== 1) ? "s" : ""));

        if (obj.hours)
            output.push(obj.hours + " Hour" + ((obj.hours !== 1) ? "s" : ""));

        //if (obj.minutes)
            output.push(obj.minutes + " Minute" + ((obj.minutes !== 1) ? "s" : ""));

        //output.push(obj.seconds + " Seconds" + ((obj.seconds !== 1) ? "s" : ""));

        return output.join(', ') + '.';
    };
}]);