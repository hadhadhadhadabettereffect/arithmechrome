var activeIcon = {
    "16": "icons/active/icon16.png",
    "24": "icons/active/icon24.png",
    "32": "icons/active/icon32.png"
};

var inactiveIcon = {
    "16": "icons/inactive/icon16.png",
    "24": "icons/inactive/icon24.png",
    "32": "icons/inactive/icon32.png"
};

var active = false;

/**
 * set active state
 * @param {boolean} a - true if active
 */
function setActive(a) {
    if (a != active) {
        active = !active;
        var msgType = active ? "parse" : "hide";
        // update icon
        chrome.browserAction.setIcon({
            path: active ? activeIcon : inactiveIcon
        });
        // signal change
        chrome.tabs.query({}, function (tabs) {
            for (var tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    msgType: msgType
                });
            }
        });
    }
}

chrome.browserAction.onClicked.addListener(function(tab) {
    setActive(!active);
});