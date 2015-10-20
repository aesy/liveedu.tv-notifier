var Helpers = Helpers || {};

Helpers.string = {
    contains: function(subString, fullString, case_sensitive) {
        if (!subString || !fullString)
            return false;

        if (!case_sensitive) {
            subString = subString.toLowerCase();
            fullString = fullString.toLowerCase();
        }

        return fullString.indexOf(subString) != -1;
    }
};