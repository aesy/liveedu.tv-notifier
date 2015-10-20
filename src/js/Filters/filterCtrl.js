app.controller("filterCtrl", ["filterService", function (filter) {
    var vm = this;

    vm.input = "";
    vm.category = "";
    vm.difficulty = "";

    vm.difficulties = [
        {label: "Any Difficulty", value: ""},
        {label: "Beginner", value: "beginner"},
        {label: "Intermediate", value: "intermediate"},
        {label: "Expert", value: "expert"}
    ];

    vm.categories = [
        {label: "Category", value: ""},
        {label: "Obj-C/Swift(iOS)", value: "Obj-C/Swift(iOS)"},
        {label: "Java", value: "Java"},
        {label: "Android", value: "Android"},
        {label: "C/C++", value: "C/C++"},
        {label: "C#/.NET", value: "C#/.NE"},
        {label: "Python", value: "Python"},
        {label: "JavaScript", value: "JavaScript"},
        {label: "PHP", value: "PHP"},
        {label: "Ruby", value: "Ruby"},
        {label: "SQL", value: "SQL"},
        {label: "HTML/CSS", value: "HTML/CSS"},
        {label: "Others", value: "Others"}
    ];

    vm.difficultyChanged = function() {
        filter.setDifficulty(vm.difficulty);
    };

    vm.categoryChanged = function() {
        filter.setCategory(vm.category);
    };

    vm.inputChanged = function() {
        filter.setString(vm.input);
    };

    vm.clear = function () {
        vm.input = "";
    };

}]);
