angular
    .module("app")
    .controller("pollingCtrl", pollingCtrl);

pollingCtrl.$inject = ["pollingService"];

function pollingCtrl(pollingService) {
    // Only used to get the pollingService started
}