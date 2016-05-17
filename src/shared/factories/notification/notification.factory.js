angular
	.module("app")
	.factory("notificationFactory", notificationFactory);

notificationFactory.$inject = ["browserService"];

function notificationFactory(browser) {
    var notifications = {}, // Collection of notifications, object keys = notification ids
        idName = "livecoding_tv_notifier",
        idNumb = 0;

    /**
     * Listen to notification click event
     */
    browser.notification.bind('click', function(id) {
        notifications[id].click();
    });

    /**
     * Listen to notification close event
     */
    browser.notification.bind('close', function(id) {
        remove(id);
    });

    /**
     * Add notification object to collection
     * @param notification (Notification object)
     * @read documentation Notification object returned by this factory
     * @return undefined
     */
    function add(notification) {
        notifications[notification.getId()] = notification;
    }

    /**
     * Remove notification object from collection by id
     * @param id (string)
     * @return undefined
     */
    function remove(id) {
        delete notifications[id];
    }

    /**
     * Get an unique id for notification
     * @return string
     */
    function getNewId() {
        idNumb++;
        return idName + idNumb;
    }

    /**
     * Notification object
     * @param data (object) of structure:
       {
         (string) title
         (string) message
         (optional string) url - opened in browser when notification is clicked
         (optional int) time - seconds to display notification
       }
     */
    return function(data) {
        var title = data.title,
            message = data.message,
            url = data.url,
            id = getNewId(),
            persistent = data.persistent || false;

        /**
         * Get this notifications unique ID
         * @return string
         */
        this.getId = function() {
            return id;
        };

        /**
         * Display this notification
         * May only be called once
         * @return undefined
         */
        this.display = function() {
            browser.notification.create(id, {
                requireInteraction: persistent,
                iconUrl: "img/128_1.png",
                buttons: [],
                type: "basic",
                title: title,
                message: message,
                isClickable: true
            });
        };

        /**
         * Close this notification prematurely
         * @return undefined
         */
        this.close = function() {
            browser.notification.remove(id);
        };

        /**
         * User clicked notification, notification will be closed and removed, and
         * if a URL was provided when creating notification, it will be opened in browser
         * @return undefined
         */
        this.click = function() {
            if (url)
                browser.openTab(url);

            this.close();
        };

        // Add notification to collection
        add(this);
    };
}