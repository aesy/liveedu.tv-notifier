angular
    .module("app")
    .filter("capitalize", capitalize);

capitalize.$inject = [];

/**
 * Capitalize filter
 * @usage:
 *   <span>{{myCoolText|capitalize}}</span>
 */
function capitalize() {
    /**
     * Will turn each starting word of a string to upper case
     * @param input (string)
     * @return string
     */
    return function (input) {
        if (!input)
            return;

        return input.split(". ").map(function(sentance) {
            return sentance.substring(0, 1).toUpperCase() + sentance.substring(1);
        }).join(". ");
    };
}