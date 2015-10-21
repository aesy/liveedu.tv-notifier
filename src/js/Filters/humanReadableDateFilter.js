app.filter('humanReadableDate', [function () {
    return function (date) {
        if (!date)
            return;

        var obj = Helpers.date.diff(Date.now(), new Date(date));
        var output = [];

        if (obj.years)
            output.push(obj.years + " Years");

        if (obj.months)
            output.push(obj.months + " Months");

        if (obj.days)
            output.push(obj.days + " Days");

        if (obj.hours)
            output.push(obj.hours + " Hours");

        if (obj.minutes)
            output.push(obj.minutes + " Minutes");

        output.push(obj.seconds + " Seconds");

        return output.join(', ') + '.';
    };
}]);