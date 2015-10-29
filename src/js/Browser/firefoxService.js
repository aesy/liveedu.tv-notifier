app.service("firefoxService", ["$q", function ($q) {
    this.openTab = function (url) {
        portEmit("nameofExt", {
            command: "tabs.create",
            value: {
                url: url
            }
        });
    };

    this.setBadge = function (number) {
        portEmit("nameofExt", {
            command: "browserAction.setBadgeText",
            value: {
                text: number ? '' + number : ''
            }
        });
    };

    this.getBadge = function () {
    };
}]);
