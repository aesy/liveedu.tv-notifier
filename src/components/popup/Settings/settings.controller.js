angular
    .module("app")
    .controller("settingsCtrl", settingsCtrl);

settingsCtrl.$inject = ["$timeout", "$q", "lodash", "browserService", "settingsService"];

function settingsCtrl($timeout, $q, _, browser, settings) {
    var vm = this;

    vm.soundOptions = [
        {label: "Disabled", value: ""},
        {label: "Soft1", value: "snd/soft1.wav"},
        {label: "Soft2", value: "snd/soft2.wav"},
        {label: "Soft3", value: "snd/soft3.wav"},
        {label: "Soft4", value: "snd/soft4.wav"}
    ];

    vm.settings = {};
    vm.favorites = [];
    vm.selectedSound = vm.soundOptions[0];
    vm.pollingRate = 1;
    vm.saving = false;
    vm.success = false;

    vm.getFavorites = function() {
        settings.getFavorites().then(function(data) {
            vm.favorites = data;
        });
    };

    vm.toggleFavorite = function (name) {
        _.remove(vm.favorites, name);
    };

    vm.soundChange = function(item) {
        if (item.value)
            new Audio(item.value).play();
    };

    vm.update = function() {
        vm.selectedSound = _.filter(vm.soundOptions, function(obj) {
            return obj.value === vm.settings.soundClip.value;
        })[0];

        vm.pollingRate = vm.settings.pollFrequency;
    };

    vm.openLink = function(url) {
        browser.openTab(url);
    };

    vm.save = function() {
        if (vm.saving)
            return;
        else
            vm.saving = true;

        var settingsPromise = settings.set({
            soundClip: {
                value: vm.selectedSound.value
            },
            pollFrequency: parseInt(vm.pollingRate, 10)
        });

        //var favoritePromise = storage.setFavorites(vm.favorites);

        $q.all([settingsPromise]).then(function() {
            vm.saving = false;
            vm.success = true;

            $timeout(function() {
                vm.success = false;
            }, 3 * 1000);
        });
    };

    settings.get().then(function(data) {
        vm.settings = data;

    //    vm.getFavorites();
        vm.update();
    });
}