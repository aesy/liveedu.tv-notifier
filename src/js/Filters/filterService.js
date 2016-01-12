app.factory("filterService", ["lodash", function (_) {
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
                var matches = [stream.username, stream.title, stream.country]
                    .map(function(value) {
                        return _.contains(value.toLowerCase(), string.toLowerCase());
                    });

                values.push(_.any(matches));
            }

            if (category)
                values.push(stream.tags == category);

            if (difficulty)
                values.push(stream.skill == difficulty);

            return _.all(values);
        }
    };
}]);
