app.controller("settingsCtrl", ["$timeout", "$q", "lodash", "storageService", "browserService", function ($timeout, $q, _, storage, browser) {
    var vm = this;

    vm.soundOptions = [
        {label: 'Disabled', value: ''},
        {label: 'Soft1', value: 'snd/Soft1.wav'},
        {label: 'Soft2', value: 'snd/Soft2.wav'},
        {label: 'Soft3', value: 'snd/Soft3.wav'},
        {label: 'Soft4', value: 'snd/Soft4.wav'}
    ];

    vm.settings = {};
    vm.favorites = [];
    vm.selectedSound = vm.soundOptions[0];
    vm.pollingRate = 1;
    vm.saving = false;
    vm.success = false;

    vm.getFavorites = function() {
        storage.getFavorites().then(function(data) {
            vm.favorites = data;
        });
    };

    vm.toggleFavorite = function (name) {
        _.remove(vm.favorites, name);
    };

    vm.soundChange = function() {
        if (vm.selectedSound.value)
            new Audio(vm.selectedSound.value).play();
    };

    vm.update = function() {
        vm.selectedSound = _.filter(vm.soundOptions, function(obj) {
            return _.isObject(obj) && obj['value'] == vm.settings.sound;
        })[0];

        vm.pollingRate = vm.settings.pollingRate / 60;
    };

    vm.openLink = function(url) {
        browser.openTab(url);
    };

    vm.save = function() {
        if (vm.saving)
            return;
        else
            vm.saving = true;

        var settingsPromise = storage.setSettings({
            sound: vm.selectedSound.value,
            pollingRate: vm.pollingRate * 60
        });

        var favoritePromise = storage.setFavorites(vm.favorites);

        $q.all([settingsPromise, favoritePromise]).then(function() {
            vm.saving = false;
            vm.success = true;

            $timeout(function() {
                vm.success = false;
            }, 3 * 1000);
        });
    };

    storage.getSettings().then(function(data) {
        vm.settings = data;

        vm.getFavorites();
        vm.update();
    });

}]);