angular
    .module("app")
    .controller("filterCtrl", filterCtrl);

filterCtrl.$inject = ["filterService"];

function filterCtrl(filter) {
    var vm = this;

    vm.input = ""; // Filter string
    vm.category = ""; // Category filter
    vm.difficulty = ""; // Difficulty filter

    // Difficult options
    vm.difficulties = [
        {label: "Any Difficulty", value: ""},
        {label: "Beginner", value: "beginner"},
        {label: "Intermediate", value: "intermediate"},
        {label: "Expert", value: "expert"}
    ];

    // TODO: Add more category values
    /**
     * Category options. Value can be either string or array of strings
     */
    vm.categories = [
        {label: "Category", value: ""},
        {label: "Obj-C/Swift(iOS)", value: [
            "ObjC",
            "Swift"
        ]},
        {label: "Java", value: "Java"},
        {label: "Android", value: "Android"},
        {label: "C/C++", value: [
            "C-C++",
            "C++"
        ]},
        {label: "C#/.NET", value: [
            ".NET",
            "C#"
        ]},
        {label: "Python", value: "Python"},
        {label: "JavaScript", value: [
            "JavaScript",
            "TypeScript",
            "CoffeeScript"
        ]},
        {label: "PHP", value: [
            "PHP",
            "Laravel",
            "Wordpress"
        ]},
        {label: "Ruby", value: "Ruby"},
        {label: "SQL", value: "SQL"},
        {label: "HTML/CSS", value: [
            "HTML-CSS",
            "HTML5",
            "CSS"
        ]}
    ];

    /**
     * Called on vm.difficulty change
     * @param difficulty (string)
     * @return undefined
     */
    vm.difficultyChanged = function(difficulty) {
        filter.setDifficulty(difficulty.value);
    };

    /**
     * Called on vm.category change
     * @param category (string | array)
     * @return undefined
     */
    vm.categoryChanged = function(category) {
        filter.setCategory([].concat(category.value));
    };

    /**
     * Called on vm.input change
     * @return undefined
     */
    vm.inputChanged = function() {
        filter.setString(vm.input);
    };

    /**
     * Clear input string
     * @return undefined
     */
    vm.clear = function () {
        vm.input = "";
        vm.inputChanged();
    };
}