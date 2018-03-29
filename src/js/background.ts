import { options as defaultOptions } from "./defaults";

const activeIcons = {
    "16": "icons/active/icon16.png",
    "24": "icons/active/icon24.png",
    "32": "icons/active/icon32.png"
};
const inactiveIcons = {
    "16": "icons/inactive/icon16.png",
    "24": "icons/inactive/icon24.png",
    "32": "icons/inactive/icon32.png"
};
var options = defaultOptions;

chrome.storage.onChanged.addListener(onOptionsUpdate);
chrome.tabs.onUpdated.addListener(onTabsUpdate);
chrome.tabs.onActivated.addListener(onTabChange);
chrome.storage.sync.get(defaultOptions, function (storedOptions) {
    options = storedOptions;
    if (options.active) msgTab();
    else updateIcon();
});

function onTabChange (activeInfo) {
    // check if url is in list
    chrome.tabs.sendMessage(activeInfo.tabId, {
        active: options.active,
        colors: options.colors
    });
}

function onTabsUpdate (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, {
            active: options.active,
            colors: options.colors
        });
    }
}

function onOptionsUpdate (changes, areaName) {
    if (areaName == "sync") {
        for (let k in changes) options[k] = changes[k].newValue;
        if (changes.hasOwnProperty("active")) updateIcon();
        msgTab();
    }
}

function msgTab () {
    var msg = {
        active: options.active,
        colors: options.colors
    };
    // send msg to active tab first
    chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, msg);
    });
    // // send msg to all tabs
    // chrome.tabs.query({}, function (tabs) {
    //     for (let tab of tabs) {
    //         chrome.tabs.sendMessage(tab.id, msg);
    //     }
    // });
}

function updateIcon () {
    chrome.browserAction.setIcon({path: options.active ?
        activeIcons : inactiveIcons });
}