import { options as defaultOptions } from "./defaults";

var options = defaultOptions;

chrome.storage.onChanged.addListener(onOptionsUpdate);
chrome.tabs.onUpdated.addListener(onTabsUpdate);
chrome.storage.sync.get(defaultOptions, function (storedOptions) {
    options = storedOptions;
    msgTab();
});

function onTabsUpdate (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, options.colors);
    }
}

function onOptionsUpdate (changes, areaName) {
    if (areaName == "sync"){
        if (changes.hasOwnProperty("active")) {
            options.active = changes.active.newValue;
            if (options.active) {
                // send parse msg to active tab if not on ignore list
                // the send parse msg to open tabs not on ignore list
            } else {
                // send parse msg if current tab not on ignore list
            }
        }
        if (changes.hasOwnProperty("ignore")) {

        }
        if (changes.hasOwnProperty("colors")) {
            options.colors = changes.colors.newValue;
            // if options.active
            // send msg to current tab, the each tab not on the ignore list
            msgTab();
        }
    }
}

function msgTab () {
    chrome.tabs.query({currentWindow: true, active: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, options.colors);
    });
}