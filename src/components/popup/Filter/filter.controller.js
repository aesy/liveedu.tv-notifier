angular
    .module("app")
    .controller("filterCtrl", filterCtrl);

filterCtrl.$inject = ["filterService"];

function filterCtrl(filter) {
    var vm = this;

    vm.input = "";
    vm.category = "";
    vm.difficulty = "";

    // TODO: finish list
    vm.difficulties = [
        {label: "Any Difficulty", value: ""},
        {label: "Beginner", value: "beginner"},
        {label: "Intermediate", value: "intermediate"},
        {label: "Expert", value: "expert"}
    ];

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
            "CoffeeScript",
            ".js"
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

    vm.difficultyChanged = function(difficulty) {
        filter.setDifficulty(difficulty.value);
    };

    vm.categoryChanged = function(category) {
        filter.setCategory(category.value);
    };

    vm.inputChanged = function() {
        filter.setString(vm.input);
    };

    vm.clear = function () {
        vm.input = "";
        vm.inputChanged();
    };
}