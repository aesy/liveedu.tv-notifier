app.service("notificationService", ["notificationFactory", function (Notification) {
    // TODO: Give all notifications an unique id which can be used to retrieve said notification
    var notifications = [];

    (function init(){
        // chrome.notifications.onButtonClicked.addListener(clicked);
    })();

    function add(notification) {
        notifications.push(notification);
    }

    function remove(id) {
        notifications.splice(id, 1);
    }

    function create(data) {
        var notification = new Notification(notifications.length, data);

        add(notification);

        return notification;
    }

    function clicked(id, button) {
        notifications[id].clicked(button);
        remove(id);
    }

    return {
        create: create,
        clicked: clicked
    };
}]);