app.filter('humanReadableDate', ["lodash", function (_) {
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

    return function (date) {
        if (!date)
            return;

        var obj = dateDiff(Date.now(), new Date(date));
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