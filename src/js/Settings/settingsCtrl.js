app.controller("settingsCtrl", ["$timeout", "storageService", "browserService", function ($timeout, storage, browser) {
    var vm = this;

    var settings = {};
    vm.saving = false;

    vm.soundOptions = [
        {label: 'Disabled', value: ''},
        {label: 'Soft1', value: 'snd/soft1.wav'},
        {label: 'Soft2', value: 'snd/soft2.wav'},
        {label: 'Soft3', value: 'snd/soft3.wav'},
        {label: 'Soft4', value: 'snd/soft4.wav'},
        {label: 'Custom...', value: ''}
    ];

    vm.favorites = [];
    vm.selectedSound = vm.soundOptions[0];
    vm.pollingRate = 1;

    vm.onSoundChanged = function() {
        if (!Helpers.array.contains(vm.selectedSound, vm.soundOptions)) {
            // TODO: Doesn't Work
            //angular.element('#uploadSound').triggerHandler('click');
        }
    };

    vm.getFavorites = function() {
        storage.getFavorites().then(function(data) {
            vm.favorites = data;
        });
    };

    vm.toggleFavorite = function (name) {
        vm.favorites = Helpers.array.removeValue(vm.favorites, name);
    };

    vm.update = function() {
        vm.selectedSound = settings.sound;
        vm.pollingRate = settings.pollingRate;
    };

    vm.openLink = function(url) {
        browser.openTab(url);
    };

    vm.save = function() {
        if (vm.saving)
            return;
        else
            vm.saving = true;

        //storage.setSettings({
        //    sound: vm.selectedSound.value,
        //    pollingRate: vm.pollingRate
        //});

        //storage.setFavorites(vm.favorites);

        $timeout(function() {
            vm.saving = false;
        }, 3 * 1000)
    };

    //storage.getSettings().then(function(data) {
    //    vm.settings = data;

    //    //vm.getFavorites();
    //    vm.update();
    //});

}]);