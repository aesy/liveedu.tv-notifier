app.factory("notificationFactory", [function () {

    //chrome.notifications.onClicked.addListener(clicked);
    //chrome.notifications.onButtonClicked.addListener(clicked);

    //function btnClicked(button) {
    //    switch (button) {
    //        case 0:
    //            // First button clicked
    //            window.open(data.url);
    //            break;
    //        case 1:
    //            // Second
    //            break;
    //    }
    //}

    return function(id, data) {
        var title = data.title;
        var message = data.message;

        this.display = function() {
            chrome.notifications.create(
                "" + id,
                {
                    iconUrl: "img/128_1.png",
                    buttons: [],
                    type: "basic",
                    title: title,
                    message: message,
                    eventTime: new Date().getTime() + 5,
                    isClickable: true
                },
                function (id) {
                } // callback
            );
        };

        this.clicked = function() {
        };
    };
}]);