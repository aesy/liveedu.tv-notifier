angular
	.module("app")
	.service("firefoxService", firefoxService);

firefoxService.$inject = [];

function firefoxService() {

    // TODO: Make extension work with firefox

    //return {
    //    openTab: openTab,
    //    setBadge: setBadge
    //};
    //
    //function openTab(url) {
    //    portEmit("nameofExt", {
    //        command: "tabs.create",
    //        value: {
    //            url: url
    //        }
    //    });
    //}
    //
    //function setBadge(number) {
    //    portEmit("nameofExt", {
    //        command: "browserAction.setBadgeText",
    //        value: {
    //            text: number ? "" + number : ""
    //        }
    //    });
    //}
}
