angular
    .module("app")
    .controller("settingsCtrl", settingsCtrl);

settingsCtrl.$inject = ["$timeout", "lodash", "browserService", "settingsService"];

function settingsCtrl($timeout, _, browser, settings) {
    var vm = this;

    vm.opts = {}; // temporary (unsaved) settings
    vm.success = false;

    /**
     * Listen for changes in settings
     */
    settings.on("change", updateSettings);
    settings.on("ready", updateSettings);

    /**
     * Update temporary settings object
     * @return undefined
     */
    function updateSettings() {
        vm.opts = settings.get();
    }

    /**
     * Remove favorite from temporary settings (not permanent until save-button is clicked)
     * @param name (string)
     * @return undefined
     */
    vm.removeFavorite = function (name) {
        _.pull(vm.opts.follows.names, name);
        vm.opts.follows.ignore.push(name);
    };

    /**
     * Play sound when vm.opts.notification.soundClip.selected is changed
     * @param item (object) audio to play, defaults to vm.opts.notification.soundClip.selected
     * @return undefined
     */
    vm.soundChange = function(item) {
        item = item || {};

        var value = item.value !== undefined ? item.value : vm.opts.notification.soundClip.selected.value,
            volume = item.volume !== undefined ? item.volume : vm.opts.notification.soundClip.volume / 100;

        if (value) {
            var audio = new Audio(value);
            audio.volume = volume;
            audio.play();
        }
    };

    /**
     * Open url in new tab
     * @read documentation of browserService.openTab
     */
    vm.openLink = browser.openTab;

    /**
     * Save settings in storage
     * @return undefined
     */
    vm.save = function() {
        if (vm.success)
            return;
        else
            vm.success = true;

        settings.set(vm.opts);

        $timeout(function() {
            vm.success = false;
        }, 3000); // arbitrary delay is arbitrary
    };

    /**
     * Clear settings permanently
     * @return undefined
     */
    vm.clear = function() {
        settings.clear().then(updateSettings);
    };
}