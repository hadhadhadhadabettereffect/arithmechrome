var activeIcons = {
    "16": "icons/active/icon16.png",
    "24": "icons/active/icon24.png",
    "32": "icons/active/icon32.png"
};
var inactiveIcons = {
    "16": "icons/inactive/icon16.png",
    "24": "icons/inactive/icon24.png",
    "32": "icons/inactive/icon32.png"
};
var options = {
    colors: [
        "#888888",
        "#000000",
        "#67a4ff",
        "#fb1515",
        "#0c52ef",
        "#18713c",
        "#5a0eaf",
        "#f5970c",
        "#000080",
        "#6b0000",
        "none" // background
    ],
    active: true,
    usebg: false,
    background: 0
};
chrome.storage.onChanged.addListener(onOptionsUpdate);
chrome.tabs.onUpdated.addListener(onTabsUpdate);
chrome.tabs.onActivated.addListener(onTabChange);
chrome.storage.sync.get(options, function (storedOptions) {
    options = storedOptions;
    if (options.active)
        msgTab();
    else
        updateIcon();
});
chrome.browserAction.onClicked.addListener(function (tab) {
    options.active = !options.active;
    chrome.storage.sync.set(options);
});
function onTabChange(activeInfo) {
    // check if url is in list
    chrome.tabs.sendMessage(activeInfo.tabId, {
        active: options.active,
        colors: options.colors
    });
}
function onTabsUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, {
            active: options.active,
            colors: options.colors
        });
    }
}
function onOptionsUpdate(changes, areaName) {
    if (areaName == "sync") {
        for (var k in changes)
            options[k] = changes[k].newValue;
        if (changes.hasOwnProperty("active"))
            updateIcon();
        msgTab();
    }
}
function msgTab() {
    // send msg to active tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            active: options.active,
            colors: options.colors
        });
    });
}
function updateIcon() {
    chrome.browserAction.setIcon({ path: options.active ?
            activeIcons : inactiveIcons });
}
