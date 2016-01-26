angular
    .module("app")
    .controller("settingsCtrl", settingsCtrl);

settingsCtrl.$inject = ["$timeout", "lodash", "browserService", "settingsService"];

function settingsCtrl($timeout, _, browser, settings) {
    var vm = this;

    vm.settings = settings.get();
    vm.success = false;

    vm.removeFavorite = function (name) {
        _.pull(vm.settings.follows.names, name);
        vm.settings.follows.ignore.push(name);
    };

    vm.soundChange = function(item) {
        if (item.value)
            new Audio(item.value).play();
    };

    vm.openLink = function(url) {
        browser.openTab(url);
    };

    vm.save = function() {
        if (vm.success)
            return;
        else
            vm.success = true;

        settings.set(vm.settings);

        $timeout(function() {
            vm.success = false;
        }, 3 * 1000);
    };
}