angular
	.module("app")
	.factory("notificationFactory", notificationFactory);

notificationFactory.$inject = ["browserService"];

function notificationFactory(browser) {
    var notifications = {},
        id = 0;

    browser.bindNotificationClicked(function(id) {
        notifications[id].clicked();
    });

    function add(id, notification) {
        notifications[id] = notification;
    }

    function remove(id) {
        delete notifications[id];
    }

    function getId() {
        id++;
        return "livecoding_tv_notifier" + id;
    }

    return function(data) {
        var title = data.title,
            message = data.message,
            url = data.url,
            id = getId(),
            time = data.time ? data.time : 5;

        setTimeout(function() {
            remove(id);
        }, time * 1000);

        add(id, this);

        this.display = function() {
            browser.createNotification(id, {
                iconUrl: "img/128_1.png",
                buttons: [],
                type: "basic",
                title: title,
                message: message,
                eventTime: new Date().getTime() + time,
                isClickable: true
            });
        };

        this.close = function() {
            browser.removeNotification(id);
        };

        this.clicked = function() {
            if (url)
                browser.openTab(url);

            this.close();
        };
    };
}