angular
    .module("app")
    .service("filterService", filterService);

filterService.$inject = ["lodash"];

function filterService(_) {
    var string = "";
    var category = "";
    var difficulty = "";

    return {
        setString: function(input) {
            string = input;
        },
        setCategory: function(input) {
            category = input;
        },
        setDifficulty: function(input) {
            difficulty = input;
        },
        matchStream: function (stream) {
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

                values.push(_.any(matches));
            }

            if (category)
                values.push(_.includes(category, stream.category));

            if (difficulty)
                values.push(stream.difficulty === difficulty);

            return _.all(values);
        }
    };
}
