angular
    .module("app")
    .service("filterService", filterService);

filterService.$inject = ["lodash"];

function filterService(_) {
    var string = "",
        category = "",
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
        category = input;
    }

    /**
     * Set difficulty to search for
     * @param input (string)
     * @return undefined
     */
    function setDifficulty(input) {
        difficulty = input;
    }

     // TODO: fetch new stream objects using `filter_fields: coding_category__slug & coding_difficulty` in livecoding API
     // TODO: instead of filtering matching streams out.
    /**
     * Match a liveCodingStream with set filter strings
     * @param stream (liveCodingStream)
     * @read livecodingAPI->liveCodingStream
     * @return boolean is match
     */
    function matchStream(stream) {
        var values = [true];

        if (string) {
            var matches = [
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

        if (category)
            values.push(_.includes(category, stream.category));

        if (difficulty)
            values.push(stream.difficulty === difficulty);

        return _.every(values);
    }
}
