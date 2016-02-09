angular
    .module("app")
    .filter("alphanumerical", alphanumerical);

alphanumerical.$inject = [];

/**
 * Alphanumerical filter
 * @usage:
 *   <span class="{{myClass|alphanumerical}}"></span>
 */
function alphanumerical() {
    /**
     * Removes any non-alphanumeric from string
     * @param input (string)
     * @return string
     */
    return function(input) {
        if (!input)
            return;

        return input.replace(/\W+/g, "");
    };
}