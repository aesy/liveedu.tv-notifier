app.service("firefoxService", ["$q", "notificationService", function ($q, notification) {
    this.openTab = function (url) {
        portEmit("nameofExt", {
            command: "tabs.create",
            value: {
                url: url
            }
        });
    };

    this.displayNotification = function (data) {
        notification.create({
            title: data.title,
            message: data.message
        }).display();
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
