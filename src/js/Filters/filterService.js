app.factory("filterService", [function () {
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
                var name = Helpers.string.contains(string, stream.username, false);
                var title = Helpers.string.contains(string, stream.title, false);
                var country = Helpers.string.contains(string, stream.country, false);

                values.push(Helpers.array.any([name, title, country]));
            }

            if (category) {
                values.push(stream.tags == category);
            }

            if (difficulty) {
                values.push(stream.skill == difficulty);
            }

            return Helpers.array.all(values);
        }
    };
}]);
