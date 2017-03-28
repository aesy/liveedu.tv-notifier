angular
    .module("app")
    .service("filterService", filterService);

filterService.$inject = ["lodash"];

function filterService(_) {
    var string = "",
        categories = [],
        difficulty = "";

    return {
        setString: setString,
        setCategory: setCategory,
        setDifficulty: setDifficulty,
        matchStream: matchStream
    };

    /**
     * Set string to search for
     * @param input (string)
     * @return undefined
     */
    function setString(input) {
        string = input;
    }

    /**
     * Set category to search for
     * @param input (array of strings)
     * @return undefined
     */
    function setCategory(input) {
        categories = input;
    }

    /**
     * Set difficulty to search for
     * @param input (string)
     * @return undefined
     */
    function setDifficulty(input) {
        difficulty = input;
    }

     // TODO: fetch new stream objects using `filter_fields: coding_category__slug & coding_difficulty` in liveedu API
     // TODO: instead of filtering matching streams out.
    /**
     * Match a liveEduStream with set filter strings
     * @param stream (liveEduStream)
     * @read liveeduAPI->liveEduStream
     * @return boolean is match
     */
    function matchStream(stream) {
        var values = [true],
            matches;

        if (string) {
            matches = [
                stream.username,
                stream.title,
                stream.country,
                stream.description,
                stream.tags
            ].map(function(value) {
                return _.includes(value.toLowerCase(), string.toLowerCase());
            });

            values.push(_.some(matches));
        }

        if (categories.length && categories[0]) {
            matches = categories.map(function(value) {
                return value.toLowerCase() == stream.category.toLowerCase();
            });

            values.push(_.some(matches));
        }

        if (difficulty)
            values.push(stream.difficulty === difficulty);

        return _.every(values);
    }
}
