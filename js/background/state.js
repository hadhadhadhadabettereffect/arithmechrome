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

var active = true;

// TODO toggle on/off for active tab
chrome.browserAction.onClicked.addListener(function(tab) {
    // toggle active
    active = !active;
    // update icon
    chrome.browserAction.setIcon({
        path: active ? activeIcon : inactiveIcon
    });
});
