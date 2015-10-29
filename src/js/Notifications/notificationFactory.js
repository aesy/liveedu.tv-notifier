app.factory("notificationFactory", ["browserService", function (browser) {
    var notifications = {};
    var id = 0;

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
        return 'livecoding_' + id;
    }

    return function(data) {
        var title = data.title;
        var message = data.message;
        var url = data.url;
        var id = getId();
        var time = data.time ? data.time : 5;

        this.display = function() {
            chrome.notifications.create(
                "" + id,
                {
                    iconUrl: "img/128_1.png",
                    buttons: [],
                    type: "basic",
                    title: title,
                    message: message,
                    eventTime: new Date().getTime() + time,
                    isClickable: true
                },
                function (id) {
                } // callback
            );
        };

        this.close = function() {
            chrome.notifications.clear(
                "" + id,
                function(id) {
                } // callback
            );
        };

        this.clicked = function() {
            if (url)
                browser.openTab(url);

            this.close();
        };

        setTimeout(function() {
            remove(id);
        }, time * 1000);

        add(id, this);
    };
}]);