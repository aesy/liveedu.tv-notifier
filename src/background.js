var Storage = (function() {
    function get() {
        chrome.storage.sync.get("", function(data) {

        })
    }

    function set() {

    }

    return {
        get: get,
        set: set
    };
})();

var Notification = (function() {
    function get(id) {

    }

    function clicked() {

    }

    return {
        clicked: clicked
    };
})();

chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
chrome.notifications.onClicked.addListener();
chrome.notifications.onButtonClicked.addListener();